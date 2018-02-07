"use strict";

import React from "react";

import { connect } from "react-redux"
import { logout } from "../actions/fetchActions";
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


var date_style = {textAlign:'right', fontSize:'20px', marginRight:'7px'};
var mem_style = {textAlign:'left', fontSize:'16px',marginTop:'15px', paddingLeft:"20px", paddingRight:"3px"};

//var wifi_icon = require('url!../../images/WiFiON.png');
//var wifi_icon_connected = require('url!../../images/APconnected.png');
//var bat_charging_icon = require('url!../../images/battery_charging_icon.png');
var mem_icon = require('url!../../images/card_icon.png');

@connect((store) => {

    return {
        username: store.Login.data.username,
        loginStatus: store.Login.data.status,
    };
})


export default class TopBar extends React.Component {

    constructor(){

        super();
        this.keepModal = false;
        this.state = {showModal:-1};

    }


    componentWillReceiveProps(newProps){

        //console.log(newProps.RxStatus);

        //go back to main win if disconnected from tx


    }

    parseDate(date){
        if(date == undefined) return "00:00"
        var time = String(date).split(" ")[1];
        return String(time).split(":")[0]+":"+String(time).split(":")[1];
    }

    parseMem(free,total){

        if(free == undefined || total == undefined) return "N/A"
        var Free = parseFloat((free/1024).toFixed(0));
        var Total = parseFloat((total/1024).toFixed(0));

        return Free.toString()+"/"+Total.toString();

    }

    modalClosed(){

        this.keepModal = false;
        this.setState({showModal:-1});

    }

    modalButton(){

        this.keepModal = false;
        this.setState({showModal:-1});

    }

    modalText(){

            return (<label> Np text</label>)
    }

    logout(){

        this.props.dispatch(logout());
        document.cookie.split(';').forEach(function(c) {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        });
    }

    logoutWidget(){
        if(this.props.username == undefined || this.props.loginStatus != "0") return null;

        return(
            <div style={{padding:"0px", marginTop:"-8px"}}>
                <div style={{marginBottom:"-32px"}}>
                    <span style={{padding:"0px",fontSize:"10px",color:"gray"}}>
                        {this.props.username}
                    </span>
                </div>
                <br/>
                <a
                    style={{fontSize:"10px",color:"#0ABCC8"}}
                    onClick={this.logout.bind(this)}>
                    Logout
                </a>
            </div>

        )

    }

    

    render() {

        //var dformat = this.props.RxStatus.CurrentTime;

        let buttonName = "Close";
        let classN = "col-xs-4";


        return (
            <div className="container-fluid jumbotron mainBar" style={{padding:'5px', marginBottom:"10px"}}>
                <div className="row">
                    <div className="col-lg-2 col-md-2  col-xs-3 pull-left" style={mem_style}>
                        <img src={mem_icon} style={{marginRight:'1px'}}   width="12px" />
                        <label className="mem-label">
                            N/A GB
                        </label>
                        <br/>
                        {this.logoutWidget()}
                    </div>

                    <div className="col-lg-2 col-md-2 col-xs-3 pull-right" style={{paddingLeft:'0px',marginTop:'10px'}}>
                        <div style={date_style}>
                            <label className="my-label">laiks?</label>
                        </div>
                        <div className="pull-right">
                                                    </div>
                    </div>
                </div>

                <Modal isOpen={this.state.showModal >= 0} onRequestHide={this.modalClosed.bind(this)} dialogStyles={dialogStyles}>
                    <ModalHeader>
                        <ModalClose onClick={this.modalClosed.bind(this)}/>
                        <ModalTitle>Info</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {this.modalText()}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-default' onClick={this.modalButton.bind(this)}>
                            {buttonName}
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
};


