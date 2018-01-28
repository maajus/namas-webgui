"use strict;"

import React from "react";
import Button from "../components/Button";
import RF from "../pages/TxSettings/RF";
import Triggers from "../pages/TxSettings/Triggers";
import Audio from "../pages/TxSettings/Audio";
import VOX from "../pages/TxSettings/VOX";
import AES from "../pages/TxSettings/AES";

import { connect } from "react-redux"

import { fetchTxSettings } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";


const Buttons = {
    Save:0,
    MainMenu:1,
}


@connect((store) => {

    return {
        txSettings: store.TxSettings.data,
    };
})


export default class TxSettings extends React.Component {

    constructor(){
        super();

        this._isMounted = false;
        this.state = { win:"rf"}; /* initial state */
        this.data = {};

    };

    componentDidMount(){

        this._isMounted = true;
        this.props.dispatch(fetchTxSettings());

    }

    componentWillReceiveProps(newProps){

        if(newProps.txSettings == undefined) return;
        //console.log(newProps);
        this.data = newProps.txSettings;
    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Save:
                this.sendData();
                this.props.route.history.push('/download');
                break;
            case Buttons.MainMenu:
                this.props.route.history.push('/download');
                break;
            default:
                console.log("No such button");
        }
    };

    sendData(){

        this.props.dispatch(sendCommand("Set","TxSettings",this.data));

    }

    //return child depending on query string
    switchSubwindow(){

        switch(this.state.win){
            case "rf":
                return <RF
                    freq={this.props.txSettings.Frequency}
                    timeout={this.props.txSettings.Timeout}
                    callback={this.rfCallback.bind(this)}/>

            case "triggers":
                return <Triggers GPIOdata={this.props.txSettings.GPIO} RECdata={this.props.txSettings.Rec_settings} callback={this.triggersCallback.bind(this)}/>
            case "audio":
                return <Audio data={this.props.txSettings.Rec_settings} callback={this.audioCallback.bind(this)}/>
            case "vox":
                return <VOX data={this.props.txSettings.Rec_settings} callback={this.voxCallback.bind(this)}/>
            case "aes":
                return <AES callback={this.aesCallback.bind(this)}/>
                    return
        }

    }

    refresh(){

        this.props.dispatch(fetchTxSettings());
    }

    //callback from rf subwindow
    rfCallback(val){
        this.data.Frequency.F2 = val.f2.toString();
        this.data.Frequency.F3 = val.f3.toString();
        this.data.Timeout = val.timeout.toString();
    }
    triggersCallback(val){
        this.data.GPIO = val.GPIO;
        this.data.Rec_settings = val.REC;
        this.data.ResetAlarm = val.ResetAlarm;
    }
    audioCallback(val){
        this.data.Rec_settings = val;
    }
    voxCallback(val){
        this.data.Rec_settings = val;
    }

    aesCallback(val){
        this.data.EncryptionKey = val;
    }


    menuclick(val){
        this.setState({win:val});
    }


    render() {

        var style = {[this.state.win]:"active"};

        return (
            <div className="container-fluid jumbotron mainFrame">
                <h3 style={{paddingRight:"15px"}}> TX Settings </h3>
                <hr style={{padding:'10px', margin:'0px'}} />


                <div className="col-lg-2 col-md-2">
                    <ul className="nav nav-pills nav-stacked">
                        <li><a
                                className={"btn btn-primary btn-xs " +style.rf}
                                onClick={this.menuclick.bind(this,"rf")}
                            >RF
                        </a></li>
                        <li><a
                                className={"btn btn-primary btn-xs " +style.triggers}
                                onClick={this.menuclick.bind(this,"triggers")}
                            >Triggers
                        </a></li>
                        <li><a
                                className={"btn btn-primary btn-xs " +style.audio}
                                onClick={this.menuclick.bind(this,"audio")}
                            >Audio
                        </a></li>
                        <li><a
                                className={"btn btn-primary btn-xs " +style.vox}
                                onClick={this.menuclick.bind(this,"vox")}
                            >Vox
                        </a></li>
                            <li><a
                                className={"btn btn-primary btn-xs " +style.aes}
                                onClick={this.menuclick.bind(this,"aes")}
                            >AES
                        </a></li>
                    </ul>
                </div>
                <hr className="visible-xs visible-sm"/>
                <div className="col-lg-8 col-md-8">
                    {this.switchSubwindow()}
                </div>

                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                <hr className="visible-xs visible-sm visible-md "/>
                    <div className="col-sm-6 col-md-6 col-xs-6 col-lg-12">
                        <Button
                            id={Buttons.Save}
                            label="Save"
                            icon="Save"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className="col-sm-6 col-md-6 col-xs-6 col-lg-12">
                        <Button
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

