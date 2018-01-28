"use strict;"

import React from "react";
import Button from "../components/Button";
import TxInfo from "../components/TxInfo";
import LogArea from "../components/LogArea";
import Checkbox from "../components/Checkbox";
import Select from "react-select";
import { connect } from "react-redux";
import { fetchContDownloadStatus } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";


const Buttons = {
    Disconnect:0,
    MainMenu:1,
}


const repeat_options = [
    { value: "0", label: '1min' },
    { value: "1", label: '5min' },
    { value: "2", label: '10min' },
    { value: "3", label: '30min' },
];


//suscribe to redux store
@connect((store) => {

    return {
        RxConfig: store.RxConfig.data,
        RxStatus: store.RxStatus.data,
        ContDownloadStatus: store.ContDownloadStatus.data,
    };
})

export default class ContDownload extends React.Component {
    constructor(){

        super();
        this._isMounted = false;
        this.state = {status:{}};

    };

    componentDidMount(){

        this._isMounted = true;
        this.counter = 0;
        this.props.dispatch(fetchContDownloadStatus());

        //Ask for Cont status every 2s
        this.intervalID = setInterval(function(){
            this.props.dispatch(fetchContDownloadStatus());
        }.bind(this),2000);
    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }


    componentWillReceiveProps(newProps){

        if(newProps.ContDownloadStatus == undefined){
            this.counter++;
            if(newProps.RxStatus.IsConnectedToTx == "0" && this.counter > 2){
                this.props.route.history.push('/');
            }
            return;
        }
        this.setState({status:newProps.ContDownloadStatus});

    }


    componentWillUnmount(){

        this._isMounted = false;
    }

    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Disconnect:
                this.startProccess();
                break;

            case Buttons.MainMenu:
                //exit cont download mode if stopped
                if(this.state.status.Started == "0")
                    this.props.dispatch(sendCommand("Set", "ConnectToTx", {Mode:"0"}));
                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }
    };

    DisconnectTx(){

        //this.props.dispatch(sendCommand("Set", "ConnectToTx", {Mode:"0"}));
    }

    startProccess(){

        var data = this.state.status;
        if(data.Started == "1")
            data.Started = "0";
        else
            data.Started = "1";

        this.setState({status:data});
        this.sendSettings();
    }

    interruptChecked(value){
        var data = this.state.status;
        data.Interrupt = value? "1":"0";
        this.setState({status:data});
        this.sendSettings();
    }

    //leaveTxChecked(value){
        //var data = this.state.status;
        //data.LeaveTxInRec = value? "1":"0";
        //this.setState({status:data});
        //this.sendSettings();
    //}

    smsChecked(value){
        var data = this.state.status;
        data.SmsNotify = value? "1":"0";
        this.setState({status:data});
        this.sendSettings();
    }

    repeatChange(value){
        var data = this.state.status;
        data.Interval = value.value;
        this.setState({status:data});
        this.sendSettings();
    }

    sendSettings(){
        var data = this.state.status;
        this.props.dispatch(sendCommand("Set", "CommandToContDownload", data));
    }

    showSmsBox(disabled){

    if(this.props.RxConfig.WIFI == "0")
        return ({});
        
        return (
            <div>
              <Checkbox
                        style={{paddingTop:"5px"}}
                        label="SMS notifications"
                        disabled = {disabled}
                        checked={parseInt(this.state.status.SmsNotify)}
                        handler={this.smsChecked.bind(this)}/>
                </div>
        );
    }

    configlayout(){
        let disabled = false;
        if(this.state.status.Started == "1")
            disabled = true;

        return (
            <div className="row" style={{paddingTop:"20px", paddingBottom:"20px"}}>
                <div className="col-xs-6">
                    <Checkbox
                        label="Interrupt TX Rec"
                        checked={parseInt(this.state.status.Interrupt)}
                        disabled = {disabled}
                        handler={this.interruptChecked.bind(this)}/>

                        {this.showSmsBox(disabled)}
                    </div>
                <div className="col-xs-6">
                    <label> Repeat interval: </label>
                    <Select
                        name="form-field-name"
                        value={repeat_options[parseInt(this.state.status.Interval)]}
                        options={repeat_options}
                        onChange={this.repeatChange.bind(this)}
                        searchable={false}
                        clearable={false}
                        disabled={disabled}
                    />
                </div>
            </div>

        );
    }

    progressBar(){

        //console.log(this.download_info);
        let proc = "";
        let procRec = "";
        let text = "";
        let color = "";

        if(this.state.status.DownloadInfo != undefined){
            color = "#0ABCC7";
            proc = this.state.status.DownloadProc;
            text = this.state.status.DownloadInfo;
        }
        else{
            color = "#0ABCC7";
            proc = 0;
            text = "Stopped";
        }

        return(
            <div>
                <div className="progress progress-striped" style={{marginBottom:"5px"}}>
                    <div className="progress-bar progress-bar-custom"
                        role="progressbar"
                        aria-valuenow={proc}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{width: proc+"%",background:color}}>
                        <span style={{top:"6px"}}>{text}</span>
                    </div>
                </div>
            </div>
        );
    };


    render() {

        //console.log(this.state.status);
        let but_name = "Start proccess";
        if(this.state.status.Started == "1")
            but_name = "Stop proccess";

        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">

                    <h3> Continuous download </h3>
                    <hr style={{marginTop:'5px'}} />
                    <TxInfo/>
                    {this.progressBar()}
                    {this.configlayout()}
                    <LogArea value={this.state.status.Log} rows="195px"/>
                </div>
                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 twoSideButtons">
                    <div className="col-lg-12 col-xs-6">

                        <Button
                            id={Buttons.Disconnect}
                            label={but_name}
                            icon="Cont"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-xs-6">

                        <Button
                            id={Buttons.MainMenu}
                            id={Buttons.MainMenu}
                            label="Main Menu"
                            icon="Main_Menu"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>
                </div>

            </div>
        );
    }
};

