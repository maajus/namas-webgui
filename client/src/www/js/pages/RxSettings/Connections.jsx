"use strict;"
import React from "react";
import Button from "../../components/Button";
import Switch from "../../components/Switch";
import { connect } from "react-redux"
import { fetchWifiStatus } from "../../actions/fetchActions";
import { sendCommand } from "../../actions/fetchActions";

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
        eth: store.RxSettings.data.Ethernet,
    };
})



export default class Connections extends React.Component {

    constructor(props){
        super(props);

        this.state = { wifiStatus: [], eth:"0" }; //initial state
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

        if(newProps.eth != undefined)
            this.setState({eth:newProps.eth});

    }


    switchHandler(state){

        var enable = state == true ? 1 : 0; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", {WifiEnable:enable}));
        var status = this.state.wifiStatus;
        status.enabled = state;
        this.setState({wifiStatus:status});


    }

    returnData(){
        var data = this.state.eth;
        this.props.callback(data); //send data to parent
    }


    enableWifi(event){

        var enable = event.target.value == "1" ? 1 : 0; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", {WifiEnable:enable}));
        var status = this.state.wifiStatus;
        status.WIFI_Enabled = enable;
        this.setState({wifiStatus:status});
    }


    enableEth(event){

        var enable = event.target.value == "1" ? 1 : 0; //convert bool to int
        var status = this.state.eth;
        status.Enabled = enable;
        this.setState({eth:status});
        this.returnData();
    }


    enableLTE(event){

        var enable = event.target.value == "0" ? 0 : 1; //convert bool to int
        this.props.dispatch(sendCommand("Set", "CommandToRx", 
            {LteEnable:{Enable:enable,Data:parseInt(this.props.wifiStatus.Modem_data)}
            }));
        var status = this.state.wifiStatus;
        status.Modem_enabled = enable.toString();
        this.setState({wifiStatus:status});

    }


    eth_widget(){

        return(
            <div className="col-4-lg col-md-4 col-sm-4 col-xs-12" style={{paddingTop:"20px"}} >
                <ul onChange={this.enableEth.bind(this)} >
                    <li className="radioMenu">
                        <input 
                            type="radio" 
                            id="eth_on" 
                            value="1" 
                            checked={parseInt(this.state.eth.Enabled)}/>

                        <label className="radioMenu" for="eth_on">Ethernet ON </label>
                        <div className="check"></div>
                    </li>
                    <li className="radioMenu">
                        <input 
                            type="radio" 
                            id="eth_off" 
                            value="0" 
                            checked={!parseInt(this.state.eth.Enabled)}/>

                        <label className="radioMenu" for="eth_off">Ethernet OFF</label>
                        <div className="check"><div class="inside"></div></div>
                    </li>
                </ul>
            </div>

        );

    }



    wifi_widget(){

        if(this.props.RxConfig.WIFI == "0")
            return ("");

        return(
            <div className="col-4-lg col-md-4 col-sm-4 col-xs-12" style={{paddingTop:"20px"}}>

            <ul onChange={this.enableWifi.bind(this)}>
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

        </div>



        );

    }

    lte_widget(){

        if(this.props.RxConfig.LTE == "0")
            return ("");

        return(

            <div className="col-4-lg col-md-4 col-sm-4 col-xs-12" style={{paddingTop:"20px"}}>

                <ul onChange={this.enableLTE.bind(this)}>
                    <li className="radioMenu">
                        <input type="radio" id="option3" name="LTEselector" value="1" 
                            checked={parseInt(this.state.wifiStatus.Modem_enabled)}/>
                        <label className="radioMenu" for="option3">LTE ON</label>
                        <div className="check"></div>
                    </li>
                    <li className="radioMenu">
                        <input type="radio" id="option4" name="LTEselector" value="0"
                            checked={!parseInt(this.state.wifiStatus.Modem_enabled)}/>
                        <label className="radioMenu" for="option4">LTE OFF</label>
                        <div className="check"><div class="inside"></div></div>
                    </li>
                </ul>
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
            <div>

                {this.eth_widget()}
                {this.wifi_widget()}
                {this.lte_widget()}

            </div>
        );
    }
};

