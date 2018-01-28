"user strict;"

import React from "react";
import Button from "../components/Button";
import Switch from "../components/Switch";
//import Display from "../pages/RxSettings/Display";
import Network from "../pages/RxSettings/Network";
//import Storage from "../pages/RxSettings/Storage";
import Ftp from "../pages/RxSettings/Ftp";

import Wifi from "../pages/RxSettings/Wifi";
import WEB from "../pages/RxSettings/Web";
import LTE from "../pages/RxSettings/Lte";
import Connections from "../pages/RxSettings/Connections";
import SMS from "../pages/RxSettings/Sms";
import VPN from "../pages/RxSettings/Vpn";

import { connect } from "react-redux"

import { fetchRxSettings } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { setRxSettings } from "../actions/fetchActions";
import { fetchWifiSettings } from "../actions/fetchActions";
import { fetchWifiStatus } from "../actions/fetchActions";



var Buttons = {
    Save:0,
    MainMenu:1,
}



@connect((store) => {

    return {
        rxSettings: store.RxSettings.data,
        wifiSettings: store.WifiSettings.data,
    };
})


export default class Network_win extends React.Component {

    constructor(props){
        super(props);
        this.data = {rxSettings:{}, wifiSettings:{}};
        this.state = {win:"connections"};
    };

    componentDidMount(){

        this._isMounted = true;
        this.props.dispatch(fetchRxSettings());
        this.props.dispatch(fetchWifiSettings());

        //Ask for Txstatus every 1s
        this.wifiTimer = setInterval(function(){
            this.props.dispatch(fetchWifiStatus());
        }.bind(this),2000);


    }


    componentWillUnmount(){
        this._isMounted = false;
        clearInterval(this.wifiTimer);
    }

    componentWillReceiveProps(newProps){

        //console.log(newProps);

        if(newProps.rxSettings != undefined){
            this.data.rxSettings = newProps.rxSettings;
        }
        if(newProps.wifiSettings != undefined){
            this.data.wifiSettings = newProps.wifiSettings;
        }

        //if(newProps.modemSettings != undefined){
            //this.data.modemSettings = newProps.modemSettings;
        //}



    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Save:
                this.sendData();

                break;
            case Buttons.MainMenu:

                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };

    ValidateIPaddress(ipaddress) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }
        return (false)
    }


    sendData(){

        var macregex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
        if(!this.ValidateIPaddress(this.data.rxSettings.Ethernet.IP))
            this.data.rxSettings.Ethernet.IP="";
        if(!this.ValidateIPaddress(this.data.rxSettings.Ethernet.Mask))
            this.data.rxSettings.Ethernet.Mask="";
        if(!this.ValidateIPaddress(this.data.rxSettings.Ethernet.Gateway))
            this.data.rxSettings.Ethernet.Gateway="";
        if(!this.ValidateIPaddress(this.data.rxSettings.Ethernet.DNS1))
            this.data.rxSettings.Ethernet.DNS1="";
        if(!this.ValidateIPaddress(this.data.rxSettings.Ethernet.DNS2))
            this.data.rxSettings.Ethernet.DNS2="";

        if(!macregex.test(this.data.rxSettings.Ethernet.MAC))
            this.data.rxSettings.Ethernet.MAC = "";


        this.props.dispatch(sendCommand("Set","RxSettings",this.data.rxSettings));
        this.props.dispatch( sendCommand("Set", "WifiSettings", this.data.wifiSettings));
        //console.log(this.data.rxSettings);
    }

    //return child depending on query string
    switchSubwindow(){

        //console.log(this.props);
        //console.log(this.props.location.query);
        var display = {backlight_level:this.props.rxSettings.backlight_level,
            backlight_dim_timeout:this.props.rxSettings.backlight_dim_timeout,
            backlight_off_timeout:this.props.rxSettings.backlight_off_timeout}

        switch(this.state.win){
            case "connections":
                return (<Connections callback={this.networkSwitchCallback.bind(this)} />)
            case "network":
                return <Network/>
            case "wifi":
                return <Wifi/>
            case "ftp":
                return <Ftp/>
            case "lte":
                return <LTE/>
            case "sms":
                return <SMS/>
            case "vpn":
                return <VPN/>
            case "web":
                return <WEB/>

        }

    }

    refresh(){

        this.props.dispatch(fetchRxSettings());
    }

    networkSwitchCallback(val){
        //console.log(val);
        this.data.rxSettings.Ethernet = val;
        this.sendData();
        //this.refresh();

    }

    webCallback(val){

    }

    menu_click(val){

        this.setState({win:val});

    }

    render() {

        //console.log(this.props.rxSettings);

        var style = {[this.state.win]:"active"};

        return (
            <div className="container-fluid jumbotron mainFrame">
                <h3> Network </h3>
                <hr style={{padding:'10px', margin:'0px'}} />

                <div className="col-lg-2 col-md-2 col-xs-12">
                    <ul className="nav nav-pills nav-stacked">
                        <li><a 
                                className={"btn btn-primary " +style.connections} 
                                onClick={this.menu_click.bind(this,"connections")}
                            >Connections
                        </a></li>
                        <li><a 
                                className={"btn btn-primary " +style.network} 
                                onClick={this.menu_click.bind(this,"network")}
                            >Ethernet
                        </a></li>
                        <li><a 
                                className={"btn btn-primary " +style.wifi} 
                                onClick={this.menu_click.bind(this,"wifi")}
                            >WiFi AP</a></li>
                        <li><a 
                                className={"btn btn-primary " +style.lte} 
                                onClick={this.menu_click.bind(this,"lte")}
                            >LTE</a></li>
                        <li><a 
                                className={"btn btn-primary " +style.sms} 
                                onClick={this.menu_click.bind(this,"sms")}
                            >SMS Commands
                        </a></li>
                        <li><a 
                               className={"btn btn-primary " +style.ftp} 
                                onClick={this.menu_click.bind(this,"ftp")}
                            >FTPS</a></li>
                        <li><a 
                                className={"btn btn-primary " +style.vpn} 
                                onClick={this.menu_click.bind(this,"vpn")}
                            >VPN</a></li>
                        {/*
                        <li><a 
                                className={"btn btn-primary " +style.web} 
                                onClick={this.menu_click.bind(this,"web")}
                            >WEB GUI</a></li>
                            */}
                    </ul>
                </div>
                <hr className="visible-xs visible-sm"/>
                <div className="col-xs-12 visible-sm visible-xs" style={{height:"30px"}}/>
                <div className="col-lg-8 col-md-10 col-xs-12" style={{padding:"0px", height:"400px"}}>
                    {this.switchSubwindow()}
                </div>

                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                <hr className="visible-xs visible-sm visible-md" style={{marginTop:"10px"}}/>
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

