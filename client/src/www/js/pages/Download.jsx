"use strict;"

import React from "react";
import Button from "../components/Button";
import TxInfo from "../components/TxInfo";
import LogArea from "../components/LogArea";
import { connect } from "react-redux"
//import { fetchDownloadStatus } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { Mode } from "../modules/Constants.js";

import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';

const ModalInfo = {
    Rec:1,
    MemoryFull:2,
    HasPartRecs:3,
}

const dialogStyles = {
    base: {
        top: -900,
        transition: 'top 0.5s'
    },
    open: {
        top: 200
    }
}



const Buttons = {
    Disconnect:0,
    MainMenu:1,
    TxSettings:2,
    TxTimers:3,
    TxRecords:4,
}


var message_firstime = {wasInRec:true, memFull:true, HasPartRecs:true};

//suscribe to redux store
@connect((store) => {

    return {
        RxStatus: store.RxStatus.data,
        TxIsRecording: store.TxStatus.data.IsRecording,
        MemoryFull: store.TxStatus.data.MemoryFull,
        DownloadStatus: store.DownloadStatus.data,
        TxWasRecording: store.TxStatus.data.BeenRecording,
        TxHasPartRecs: store.TxStatus.data.hasPartRecs,
    };
})


export default class Download extends React.Component {

    constructor(){

        super();
        this.downloadProgress = 0;
        this.disconnect = false;
        this._isMounted = false;
        this.download_info = {text:"",progress:0,progressRec:0,download_completed:false};
        this.download_completed = false;
        this.state = {showModal:-1};

    };

    componentDidMount(){

        this._isMounted = true;
        this.showBar = false;
    }

    componentWillUnmount(){

        this.showBar = true

    }


    componentWillReceiveProps(newProps){


        if(newProps.RxStatus.IsConnectedToTx == "0" && this.disconnect){
            this.props.route.history.push('/');
        }

        //reset status for next connection
        if(newProps.RxStatus.DisconnectReason != "-1")
            message_firstime = {wasInRec:true, memFull:true, HasPartRecs:true};

        if(newProps.TxWasRecording == "1" 
            && message_firstime.wasInRec
            && newProps.RxStatus.IsConnectedToTx ==Mode.R_COMMAND
        ){
            this.setState({showModal:ModalInfo.Rec});
            message_firstime.wasInRec = false;
        }


        if(newProps.MemoryFull == "1" 
            && message_firstime.memFull 
            && newProps.RxStatus.IsConnectedToTx == Mode.R_COMMAND
        ){

            this.setState({showModal:ModalInfo.MemoryFull});
            message_firstime.memFull = false;
        }


        if(newProps.TxHasPartRecs == "2" 
            && message_firstime.HasPartRecs 
            && newProps.RxStatus.IsConnectedToTx == Mode.R_COMMAND
        ){
            this.setState({showModal:ModalInfo.HasPartRecs});
            message_firstime.HasPartRecs = false;
        }



        if(newProps.DownloadStatus.TxRecords == undefined) return;

        var info = newProps.DownloadStatus.TxRecords.TxRecord;
        this.download_info = {
            text:info.download_status_info,
            progress:info.download_status_total,
            progressRec:info.download_status,
            rec_nr:info.rec_nr,
            download_completed:parseInt(info.download_completed)
        };


    }


    componentWillUnmount(){

        this._isMounted = false;
    }

    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Disconnect:
                this.DisconnectTx();
                this.disconnect = true;
                this.props.route.history.push('/');
                break;
            case Buttons.TxSettings:
                this.props.route.history.push('/txsettings');
                break;

            case Buttons.TxTimers:
                this.props.route.history.push('/txtimers');
                break;

            case Buttons.TxRecords:
                this.props.route.history.push('/txrecords');
                break;

            case Buttons.MainMenu:

                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };

    stopDownloadClicked(){

        this.props.dispatch(sendCommand("Set", "CommandToTx", {StopDownload:"1"}));
        this.showBar = false;

    }

    DisconnectTx(){

        this.props.dispatch(sendCommand("Set", "ConnectToTx", {Mode:"0"}));
    }


    //format text in Modal
    modalClosed(){

        this.setState({showModal:-1});
    }

    modalYesClicked(){

        this.props.dispatch(sendCommand("Set", "CommandToTx", {DownloadPartRecs:"1"}));
        this.setState({showModal:-1});
    }



    progressBar(){

        //console.log("Proc: "+this.download_info.progress);
        //console.log("Rec Proc: "+this.download_info.progressRec);
        //console.log("Rec nr: "+this.download_info.rec_nr);
        //console.log("Completed: "+this.download_info.download_completed+"\n\n\n");

        if(this.download_info.rec_nr == undefined) return

        this.download_completed = this.download_info.download_completed;
        //this nonsense to keep bar visible after download completed
        if(this.download_info.rec_nr != "-1") { //downloading
            if(this.download_info.progress > 0)
                this.showBar = true;
        }
        else 
            if(this.download_completed == false) 
                return


        if(!this.showBar) return;
        
        let proc = "";
        let procRec = "";
        let text = "";
        let color = "";

        if(this.download_completed){
            proc = "100";
            procRec = "100";
            text = "Completed";
            color = "#41CD3B";
        }
        else{
            color = "#0ABCC7";
            proc = this.download_info.progress;
            procRec = this.download_info.progressRec;
            text = this.download_info.text;

        }

        return(
            <div>
                <div className = "col-sm-11 col-xs-10" style={{padding:"0px"}}>
                    <div className="progress progress-striped" style={{marginBottom:"5px"}}>
                        <div className="progress-bar progress-bar-custom"
                            role="progressbar"
                            aria-valuenow={proc}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: proc+"%",background:color}}>
                            <span style={{top:"7px"}}>{text}</span>
                        </div>
                    </div>
                    <div className="progress" style={{height:"10px",marginBottom:"8px"}}>
                        <div className="progress-bar progress-bar-custom"
                            role="progressbar"
                            aria-valuenow={procRec}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: procRec+"%",height:"10px",background:color}}>
                        </div>
                    </div>
                </div>

                <div className = "col-sm-1 col-xs-2" style={{padding:"0px",paddingLeft:"15px"}}>
                    <button className='btn btn-default' onClick={this.stopDownloadClicked.bind(this)}>
                        X
                    </button>
                </div>
            </div>
        );
    };


    render() {

        let modalText, modalNoText="Close", hidden="hidden";

        switch(this.state.showModal){
            case ModalInfo.Rec:
                modalText = "Tx has been Recording";
                break;
            case ModalInfo.MemoryFull:
                modalText = "Tx Memory is full";
                break;
            case ModalInfo.HasPartRecs:
                modalText = "Partly downloaded records found. Continue download?";
                hidden="btn btn-default ";
                modalNoText = "No";
                break;
        }

        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-8 col-md-12 col-sm-12">

                    <h3> Download </h3>
                    <hr style={{marginTop:'5px'}} />
                    <TxInfo/>
                    {this.progressBar()}
                    <LogArea value={this.props.RxStatus.Log} rows="270px"/>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12" style={{marginTop:"40px"}}>
                    <div className="visible-lg">
                        <div className="col-lg-6">
                            <Button 
                                id={Buttons.TxRecords} 
                                label="TX Records" 
                                icon="Records_on_TX" 
                                onClick={this.buttonClick.bind(this)}/>
                            <Button 
                                id={Buttons.TxTimers} 
                                label="TX Timers" 
                                icon="TX_Timers"  
                                onClick={this.buttonClick.bind(this)}/>
                        </div>

                        <div className="col-lg-6">
                            <Button 
                                id={Buttons.TxSettings} 
                                label="TX Settings" 
                                icon="TX_Settings" 
                                onClick={this.buttonClick.bind(this)}/>
                            <Button 
                                id={Buttons.Disconnect} 
                                label="Disconnect" 
                                icon="Disconnect" 
                                onClick={this.buttonClick.bind(this)}/>
                            <Button id={Buttons.MainMenu} 
                                label="Main Menu" 
                                icon="Main_Menu"  
                                onClick={this.buttonClick.bind(this)}/>
                        </div>

                    </div>

                    <div className="row visible-xs row visible-sm visible-md">
                        <div className="row">
                            <div className="col-sm-2 col-sm-offset-1 col-xs-4">
                                <Button id={Buttons.TxRecords} 
                                    label="TX Records" 
                                    icon="Records_on_TX" 
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>
                            <div className="col-sm-2 col-xs-4">
                                <Button 
                                    id={Buttons.TxTimers} 
                                    label="TX Timers" 
                                    icon="TX_Timers"  
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>
                            <div className="col-sm-2 col-xs-4">
                                <Button 
                                    id={Buttons.TxSettings} 
                                    label="TX Settings" 
                                    icon="TX_Settings" 
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>
                            <div className="col-sm-2 col-xs-6">
                                <Button 
                                    id={Buttons.Disconnect} 
                                    label="Disconnect" 
                                    icon="Disconnect" 
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>
                            <div className="col-sm-2 col-xs-6">
                                <Button 
                                    id={Buttons.MainMenu} 
                                    label="Main Menu" 
                                    icon="Main_Menu"  
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>

                        </div>
                    </div>

                </div>

                <Modal 
                    isOpen={this.state.showModal >= 0} 
                    onRequestHide={this.modalClosed.bind(this)} 
                    dialogStyles={dialogStyles}
                >
                    <ModalHeader>
                        <ModalClose onClick={this.modalClosed.bind(this)}/>
                        <ModalTitle>Info</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {modalText}
                    </ModalBody>
                    <ModalFooter>
                        <button className={hidden} onClick={this.modalYesClicked.bind(this)}>
                            Yes
                        </button>
                        <button className='btn btn-default' onClick={this.modalClosed.bind(this)}>
                            {modalNoText} 
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
};

