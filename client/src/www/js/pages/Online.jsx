"use strict;"

import React from "react";
import Button from "../components/Button";
import TxInfo from "../components/TxInfo";
import LogArea from "../components/LogArea";
import SoundGraph from "../components/SoundGraph";
import { connect } from "react-redux"

import { startOnlineAudio } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";


import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';

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
    RecRX:2,
    RecTX:3,
    VoxLevels:4,
}


var message_firstime = {memFull:true};

@connect((store) => {

    return {
        RxStatus: store.RxStatus.data,
        TxIsRecording: store.TxStatus.data.IsRecording,
        MemoryFull: store.TxStatus.data.MemoryFull,
        Vox: store.TxStatus.data.Vox,
    };
})


export default class Online extends React.Component {

    constructor(){

        super();
        this.disconnect = false;
        this.state = {showModal:-1};

    };

    componentDidMount(){

        //request audio data stream
        this.props.dispatch(startOnlineAudio());

    }

    componentWillReceiveProps(newProps){

        //console.log(newProps.RxStatus.IsConnectedToTx);

        //return to main win if disconnected
        if(newProps.RxStatus.IsConnectedToTx == "0" && this.disconnect)
            this.props.route.history.push('/');

        //mark for disconnect in case of bad aes
        if(newProps.RxStatus.IsConnectedToTx == "7")
            this.disconnect = true;


        if(newProps.MemoryFull == "1" && message_firstime.memFull){
            this.modalText = "Tx memory full";
            this.setState({showModal:1});
            message_firstime.memFull = false;
        }



    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Disconnect:
                this.DisconnectTx();
                this.disconnect = true;
                this.props.route.history.push('/');

                break;
            case Buttons.RecRX:
                this.RecOnRx();
                break;

            case Buttons.RecTX:
                this.RecOnTX();
                break;

            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;

            case Buttons.VoxLevels:
                this.props.route.history.push('/voxlevels');
                break;

            default:
                console.log("No such button");
        }

    };

    DisconnectTx(){

        this.props.dispatch(sendCommand("Set", "ConnectToTx", {Mode:"0"}));

    }
    RecOnTX(){

        this.props.dispatch(sendCommand("Set", "CommandToTx", {RecCommand:"1"}));

    }

    RecOnRx(){

        if(this.props.RxStatus.IsRecording == "0")
            this.props.dispatch(sendCommand("Set", "CommandToRx", {RecOnRx:"1"}));
        else
            this.props.dispatch(sendCommand("Set", "CommandToRx", {RecOnRx:"0"}));
    }

    modalClosed(){

        this.setState({showModal:-1});
    }



    render() {

        //set red icons if recording on rx or tx
        let RxRecIcon = "";
        let TxRecIcon = "Rec_on_TX";
        if(this.props.RxStatus.IsRecording == 1)
            RxRecIcon = "Rec_on_RX_on";
        else
            RxRecIcon = "Rec_on_RX";

        if(this.props.TxIsRecording == 1){
            if(this.props.Vox == "1")
                TxRecIcon = "Rec_on_TX_vox";
            else
                TxRecIcon = "Rec_on_TX_on";
        }
        else
            TxRecIcon = "Rec_on_TX";


        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-8 col-md-12 col-sm-12">

                    <h3> Online </h3>
                    <hr style={{marginTop:'5px'}} />
                    <TxInfo hideMemory={true}/>
                    <LogArea value={this.props.RxStatus.Log} rows="160px"/>
                    <div style={{height:"10px"}}/>
                    <SoundGraph 
                        connected={this.props.RxStatus.IsConnectedToTx} 
                        smallBigger={true}
                        height={"350"} 
                    />
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12" style={{marginTop:"40px"}}>
                    <div className="visible-lg">
                        <div className="col-lg-6">
                            <Button id={Buttons.RecTX} label="Rec on TX" icon={TxRecIcon} onClick={this.buttonClick.bind(this)}/>
                            <Button id={Buttons.VoxLevels} label="Vox levels" icon="vox"  onClick={this.buttonClick.bind(this)}/>
                        </div>

                        <div className="col-lg-6">
                            <Button id={Buttons.RecRX} label="Rec on RX" icon={RxRecIcon} onClick={this.buttonClick.bind(this)}/>
                            <Button id={Buttons.Disconnect} label="Disconnect" icon="Disconnect"  onClick={this.buttonClick.bind(this)}/>
                            <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                        </div>
                    </div>

                    <div className="row visible-xs row visible-sm visible-md">
                        <div className="row">
                            <div className="col-sm-2 col-sm-offset-1 col-xs-4">
                                <Button 
                                    id={Buttons.RecTX} 
                                    label="Rec on TX" 
                                    icon={TxRecIcon}  
                                    onClick={this.buttonClick.bind(this)}/>
                            </div>


                        <div className="col-sm-2 col-xs-4">
                            <Button 
                                id={Buttons.RecRX} 
                                label="Rec on RX"
                                icon={RxRecIcon} 
                                onClick={this.buttonClick.bind(this)}/>
                        </div>

                        <div className="col-sm-2 col-xs-4">
                            <Button 
                                id={Buttons.VoxLevels} 
                                label="Vox levels" 
                                icon="vox"  
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

                <Modal isOpen={this.state.showModal >= 0} onRequestHide={this.modalClosed.bind(this)} dialogStyles={dialogStyles}>
                    <ModalHeader>
                        <ModalClose onClick={this.modalClosed.bind(this)}/>
                        <ModalTitle>Info</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {this.modalText}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-default' onClick={this.modalClosed.bind(this)}>
                            Close
                        </button>
                    </ModalFooter>
                </Modal>



            </div>
        );
    }
};

