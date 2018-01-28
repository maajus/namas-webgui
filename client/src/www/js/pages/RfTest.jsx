"use strict;"

import React from "react";
import Button from "../components/Button";
import TxInfo from "../components/TxInfo";
import LogArea from "../components/LogArea";

import { connect } from "react-redux"
import { sendCommand } from "../actions/fetchActions";

const Buttons = {
    Disconnect:0,
    MainMenu:1,
}

@connect((store) => {

    return {
        RxStatus: store.RxStatus.data,
    };
})


export default class RfTest extends React.Component {

    constructor(){

        super();
        this.disconnect = false;

    };

    componentWillReceiveProps(newProps){


        if(newProps.RxStatus.IsConnectedToTx == "0" && this.disconnect)
            this.props.route.history.push('/');

    }

    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Disconnect:
                this.DisconnectTx();
                this.disconnect = true;
                this.props.route.history.push('/');
                break;

            case Buttons.MainMenu:

                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };

    DisconnectTx(){

        this.props.dispatch(sendCommand("Set", "ConnectToTx", {Mode:"0"}));
    }


    render() {

        var textarea = document.getElementById('log');
        if(textarea != null ) textarea.scrollTop = textarea.scrollHeight;


        return (
            <div className="container-fluid jumbotron mainFrame">

                <div className="col-lg-9 col-md-12 col-sm-12">

                    <h3> RF Test </h3>
                    <hr style={{marginTop:'5px'}} />
                    <TxInfo />
                    <LogArea value={this.props.RxStatus.Log} rows="300px"/>
                </div>

                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 twoSideButtons">
                    <div className="col-sm-6 col-md-6 col-xs-6 col-lg-12">
                        <Button
                            id={Buttons.Disconnect}
                            label="Disconnect"
                            icon="Disconnect"
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

