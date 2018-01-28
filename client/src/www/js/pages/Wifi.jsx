"use strict;"
import React from "react";
import Button from "../components/Button";
import Switch from "../components/Switch";
import { connect } from "react-redux"
import { fetchWifiStatus } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";


var Buttons = {
    Settings:0,
    Timers:1,
    MainMenu:2,
}

var intervalId;

var td_style = {
    paddingTop: '.1em',
    paddingBottom: '.5em',
    textAlign:'left',
}



@connect((store) => {

    return {
        wifiStatus: store.WifiStatus.data,
        RxConfig: store.RxConfig.data,
    };
})



export default class Wifi_win extends React.Component {

    constructor(props){
        super(props);

        this.state = { wifiStatus: [] }; //initial state
    };

    componentDidMount(){

        this.props.dispatch(fetchWifiStatus());

        intervalId = setInterval(function(){
            this.props.dispatch(fetchWifiStatus());
        }.bind(this), 5000);

        this.firsttime = true;
    }

    //
    componentWillUnmount(){
        clearInterval(intervalId);
        this.firsttime = true;
    }

    compareProps(props){
        if(this.firsttime) return false;
        if(this.props.wifiStatus.AP_Enabled != props.AP_Enabled) return false
        if(this.props.wifiStatus.SSID != props.SSID) return false
        if(this.props.wifiStatus.Client_MAC != props.Client_MAC) return false
        if(this.props.wifiStatus.Client_connected != props.Client_connected) return false
        if(this.props.wifiStatus.MAC != props.MAC) return false
        if(this.props.wifiStatus.RxIP != props.RxIP) return false
        if(this.props.wifiStatus.WIFI_Enabled != props.WIFI_Enabled) return false
        if(this.props.wifiStatus.WIFI_mode != props.WIFI_mode) return false
        if(this.props.wifiStatus.Modem_carrier != props.Modem_carrier) return false
        if(this.props.wifiStatus.Modem_signal != props.Modem_signal) return false
        if(this.props.wifiStatus.Modem_data != props.Modem_data) return false
        if(this.props.wifiStatus.Modem_data_status != props.Modem_data_status) return false
        if(this.props.wifiStatus.Modem_enabled != props.Modem_enabled) return false
        if(this.props.wifiStatus.Modem_ip != props.Modem_ip) return false
        if(this.props.wifiStatus.Modem_mode != props.Modem_mode) return false

        return true;

    }

    componentWillReceiveProps(newProps){

        //set state only if wifistatus changed
        if(newProps.wifiStatus != undefined && !this.compareProps(newProps.wifiStatus)){
            this.firsttime = false;
            this.setState({wifiStatus:newProps.wifiStatus});

            //console.log(newProps.wifiStatus);
            //console.log(this.props.wifiStatus);

        }

    }


    switchHandler(state){

        var enable = state == true ? 1 : 0; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", {WifiEnable:enable}));
        var status = this.state.wifiStatus;
        status.enabled = state;
        this.setState({wifiStatus:status});


    }



    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Settings:
                this.props.route.history.push('/wifisettings');
                break;
            case Buttons.Timers:
                break;
            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;

            default:
                console.log("No such button");
        }

    };


    enableWifi(event){

        var enable = event.target.value == "1" ? 1 : 0; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", {WifiEnable:enable}));
        var status = this.state.wifiStatus;
        status.WIFI_Enabled = enable;
        this.setState({wifiStatus:status});


    }

    enableLTE(event){

        var data = event.target.value == "0" ? 1 : 0; //convert bool to int
        var enable = event.target.value == "2" ? 0 : 1; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", {LteEnable:{Enable:enable,Data:data}}));
        var status = this.state.wifiStatus;
        status.Modem_enabled = enable.toString();
        status.Modem_data_status = data.toString();
        this.setState({wifiStatus:status});

    }


    lte_widget(){

        if(this.props.RxConfig.LTE == "0")
            return ("");
        var status = {};
        if(parseInt(this.props.RxConfig.LTE) > 0 && this.state.wifiStatus.WIFI_Enabled != undefined){
            status.Modem_enabled = this.state.wifiStatus.Modem_enabled == "1" ? "Enabled" : "Disabled";
            status.Modem_data = this.state.wifiStatus.Modem_data_status == "1"? "Enabled" : "Disabled";
            if(parseInt(this.state.wifiStatus.Modem_signal) < 0)
                status.Modem_signal = "N/A";
            else
                status.Modem_signal = "-"+this.state.wifiStatus.Modem_signal.toString() + " dbm";
        }



        return(

                    <div className="col-6-lg col-md-6 col-sm-6 col-xs-12">
                        <div className="col-lg-12 col-xs-12" 
                            style={{height:"360px",borderRadius:"5px",border:"1px solid #464545"}}>

                            <br/>
                            <ul onChange={this.enableLTE.bind(this)}>
                                <li className="radioMenu">
                                    <input type="radio" id="option1" name="LTEselector" value="0" 
                                        checked={parseInt(this.state.wifiStatus.Modem_enabled) && parseInt(this.state.wifiStatus.Modem_data_status)}/>
                                    <label className="radioMenu" for="option1">Modem ON Data mode</label>
                                    <div className="check"></div>
                                </li>
                                <li className="radioMenu">
                                    <input className="radioMenu" type="radio" id="option2" name="LTEselector" value="1"
                                        checked={parseInt(this.state.wifiStatus.Modem_enabled) && !parseInt(this.state.wifiStatus.Modem_data_status)}/>
                                    <label className="radioMenu" for="option2">Modem ON SMS mode</label>
                                    <div className="check"><div class="inside"></div></div>
                                </li>
                                <li className="radioMenu">
                                    <input type="radio" id="option3" name="LTEselector" value="2"
                                        checked={!parseInt(this.state.wifiStatus.Modem_enabled)}/>
                                    <label className="radioMenu" for="option3">Modem OFF</label>
                                    <div className="check"><div class="inside"></div></div>
                                </li>
                            </ul>



                            <div style={{paddingTop:"30px",paddingLeft:"10px"}}>
                            <table className="table" >
                                <tbody >
                                    <tr>
                                        <td style={td_style} className="my-label">Status: </td>
                                        <td style={td_style} className="my-label"><b>{status.Modem_enabled}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Carrier: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.Modem_carrier}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Network: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.Modem_mode}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Signal: </td>
                                        <td style={td_style} className="my-label"><b>{status.Modem_signal}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">RX IP: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.Modem_ip}</b></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>



                        </div>
                    </div>
        );
    }



    render() {

        //if(this.state.wifiStatus.WIFI_Enabled == undefined) return <div/>

        //console.log(this.state.wifiStatus);
        var status = {};
        //status.module = Data.WIFI_Enabled == true ? "Enabled" : "Disabled";
        //status.ap = Data.AP_Enabled == true ? "Enabled" : "Disabled";
        status.client = this.state.wifiStatus.Client_connected == true ? "Connected" : "Not connected";
        status.enabled = this.state.wifiStatus.WIFI_Enabled > 0;
        status.SSID = this.state.wifiStatus.SSID == "" ? "N/A" : this.state.wifiStatus.SSID;
        let winLabel = "Wifi/LTE";
        if(this.props.RxConfig.LTE == "0")
            winLabel = "WiFi";


        return (
            <div className="container-fluid jumbotron mainFrame">
                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                    <h3> {winLabel} </h3>
                    <hr style={{marginTop:'5px'}} />

                        <div className="col-6-lg col-md-6 col-sm-5 col-xs-12" 
                        >

                        <div className="col-lg-12 col-xs-12" 
                            style={{height:"360px",borderRadius:"5px",border:"1px solid #464545"}}>
                            <br/>
                            <ul onChange={this.enableWifi.bind(this)} style={{paddingTop:"20px"}}>
                                <li className="radioMenu">
                                    <input 
                                        type="radio" 
                                        id="f-option" 
                                        name="selector" 
                                        value="1" 
                                        checked={parseInt(this.state.wifiStatus.WIFI_Enabled)}/>

                                    <label className="radioMenu" for="f-option">Wi-Fi ON </label>
                                    <div className="check"></div>
                                </li>
                                <li className="radioMenu">
                                    <input 
                                        type="radio" 
                                        id="s-option" 
                                        name="selector" 
                                        value="0" 
                                        checked={!parseInt(this.state.wifiStatus.WIFI_Enabled)}/>

                                    <label className="radioMenu" for="s-option">Wi-Fi OFF</label>
                                    <div className="check"><div class="inside"></div></div>
                                </li>
                            </ul>


                            <div style={{paddingTop:"50px",paddingLeft:"10px"}}>
                            <table  className="table" style={{paddingLeft:"30px"}}>
                                <tbody>
                                    <tr>
                                        <td style={td_style} className="my-label">SSID: </td>
                                        <td style={td_style} className="my-label"><b>{status.SSID}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">MAC address: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.MAC}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Client: </td>
                                        <td style={td_style} className="my-label"><b>{status.client}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Client Mac: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.Client_MAC}</b></td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">RX IP: </td>
                                        <td style={td_style} className="my-label"><b>{this.state.wifiStatus.RxIP}</b></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        </div>

                    </div>

                    <div className="visible-xs col-xs-12" style={{height:"20px"}}/>
                    {this.lte_widget()}

            </div>



            <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 twoSideButtons">
                <div className="col-lg-12 col-xs-6">
                    <Button id={Buttons.Settings} label="Settings" icon="WiFi_Settings"  onClick={this.buttonClick.bind(this)}/>
                </div>
                <div className="col-lg-12 col-xs-6">
                    <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                </div>
            </div>
        </div>
        );
    }
};

