"use strict;"
import React from "react";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import Select from 'react-select';

import { connect } from "react-redux"
import { fetchWifiSettings } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { fetchRxSettings } from "../actions/fetchActions";



var Buttons = {
    Save:0,
    MainMenu:1,
}

var mode_options = [
    {value: '0', label:'auto'},
    {value: '1', label:'gsm only'},
    {value: '2', label:'3g only'},
    {value: '3', label:'lte only'},
    {value: '4', label:'gsm+3g'},
];


var ch_options = [
    { value: '1', label: '1. 2412 MHz' },
    { value: '2', label: '2. 2417 MHz' },
    { value: '3', label: '3. 2422 MHz' },
    { value: '4', label: '4. 2427 MHz' },
    { value: '5', label: '5. 2432 MHz' },
    { value: '6', label: '6. 2437 MHz' },
    { value: '7', label: '7. 2442 MHz' },
    { value: '8', label: '8. 2447 MHz' },
    { value: '9', label: '9. 2452 MHz' },
    { value: '10', label: '10. 2457 MHz' },
    { value: '11', label: '11. 2462 MHz' },
    { value: '12', label: '12. 2467 MHz' },
    { value: '13', label: '13. 2472 MHz' },

    { value: '36', label: '36. 5180 MHz' },
    { value: '40', label: '40. 5200 MHz' },
    { value: '44', label: '44. 5220 MHz' },
    { value: '48', label: '48. 5240 MHz' },
    { value: '52', label: '52. 5260 MHz' },
    { value: '56', label: '56. 5280 MHz' },
    { value: '60', label: '60. 5300 MHz' },
    { value: '64', label: '64. 5320 MHz' },
    { value: '100', label: '100. 5500 MHz' },
    { value: '104', label: '104. 5520 MHz' },
    { value: '108', label: '108. 5540 MHz' },
    { value: '112', label: '112. 5460 MHz' },
    { value: '116', label: '116. 5580 MHz' },
    { value: '120', label: '120. 5600 MHz' },
    { value: '124', label: '124. 5620 MHz' },
    { value: '128', label: '128. 5640 MHz' },
    { value: '132', label: '132. 5660 MHz' },
    { value: '136', label: '136. 5680 MHz' },
    { value: '140', label: '140. 5700 MHz' },
    { value: '149', label: '149. 5745 MHz' },
    { value: '153', label: '153. 5765 MHz' },
    { value: '157', label: '157. 5785 MHz' },
    { value: '161', label: '161. 5805 MHz' },
    { value: '165', label: '165. 5825 MHz' }
];



function channelByVal(val){

    for(var i = 0; i < ch_options.length; i++){

        if(ch_options[i].value == val)
            return ch_options[i];

    }

}


@connect((store) => {

    return {
        wifiSettings: store.WifiSettings.data,
        modemSettings: store.RxSettings.data,
        RxConfig: store.RxConfig.data,
    };
})


export default class WifiSettings extends React.Component {


    componentDidMount(){
        this.props.dispatch(fetchWifiSettings());
        this.props.dispatch(fetchRxSettings());
    }


    componentWillReceiveProps(newProps){

        console.log(newProps.wifiSettings);
        this.setState({modemSettings:newProps.modemSettings});
    }

    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Save:
                this.sendData();
                this.props.route.history.push('/wifi');

                break;
            case Buttons.MainMenu:

                this.props.route.history.push('/wifi');
                break;

            default:
                console.log("No such button");
        }

    };

    sendData(){

        this.props.dispatch( sendCommand("Set", "WifiSettings", this.props.wifiSettings));
        this.props.dispatch( sendCommand("Set", "RxSettings", this.props.modemSettings));
        //console.log(this.props.wifiSettings);

    }

    refresh(){

        this.props.dispatch( fetchWifiSettings());
    }

    hideSSIDChanged(value){

        var data = this.props.wifiSettings;
        data.HideSSID = value ? "1":"0";
        this.setState({wifiSettings:data});

    }

    ssidChanged(event){

        var data = this.props.wifiSettings;
        data.SSID = event.target.value;
        this.setState({wifiSettings:data});

    }

    passChanged(event){

        var data = this.props.wifiSettings;
        data.Passw = event.target.value;
        this.setState({wifiSettings:data});
    }

    chChanged(row){

        var data = this.props.wifiSettings;
        data.Channel = row.value;
        this.setState({wifiSettings:data});

    }

    apnChanged(event){

        var data = this.props.modemSettings;
        data.Modem.APN = event.target.value;
        this.setState({modemSettings:data});

    }


    usernameChanged(event){

        var data = this.props.modemSettings;
        data.Modem.Username = event.target.value;
        this.setState({modemSettings:data});



    }

    modemPassChanged(event){

        var data = this.props.modemSettings;
        data.Modem.Password = event.target.value;
        this.setState({modemSettings:data});

    }

    modemModeChanged(row){

        var data = this.props.modemSettings;
        data.Modem.Network_mode = row.value;
        this.setState({modemSettings:data});

    }

    nrChanged(nr,event){

        var data = this.props.modemSettings;
        data.Modem.NrList["Nr"+nr] = event.target.value;
        this.setState({modemSettings:data});

    }


    testNr(nr){
        this.props.dispatch(sendCommand("Set", "CommandToRx", {TestNr:this.state.modemSettings.Modem.NrList["Nr"+nr]}));
    }


    lte_widget(){

        if(this.props.RxConfig.LTE == "0")
            return ("");

        return (

                <div className="col-7-lg col-md-7 col-sm-12 col-xs-12">

                    <label className="nameLabel" style={{paddingTop:'10px'}}> LTE </label>

                    <div className="col-lg-12 col-xs-12" 
                        style={{height:"150px",borderRadius:"5px",border:"1px solid #464545", paddingLeft:"5px"}}>

                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                            <label style={{paddingTop:'10px'}}>
                                <label className="my-label">APN:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.APN}
                                    className="form-control mystyle"
                                    onChange={this.apnChanged.bind(this)} />
                            </label><br/>

                            <label style={{paddingTop:'5px'}}>
                                <label className="my-label">Username:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.Username}
                                    className="form-control mystyle"
                                    onChange={this.usernameChanged.bind(this)} />
                            </label><br/>
                        </div>

                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                            <label style={{paddingTop:'10px'}}>
                                <label className="my-label">Password:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.Password}
                                    className="form-control mystyle"
                                    onChange={this.modemPassChanged.bind(this)} />
                            </label><br/>

                            <label style={{paddingTop:'5px'}}>
                                <label className="my-label">Network mode:</label>
                                <Select
                                    name="form-field-name"
                                    value={mode_options[parseInt(this.props.modemSettings.Modem.Network_mode)]}
                                    options={mode_options}
                                    onChange={this.modemModeChanged.bind(this)}
                                    clearable={false}
                                />
                            </label>

                        </div>
                    </div>

                    <div className="row">
                        <label className="nameLabel" style={{paddingTop:'10px',paddingLeft:"15px"}}> SMS commands </label>
                    </div>

                    <div className="col-lg-12 col-xs-12" 
                        style={{height:"200px",borderRadius:"5px",border:"1px solid #464545", paddingLeft:"5px"}}>


                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">
                            <label style={{paddingTop:'5px'}}>
                                <label className="my-label">Phone number 1:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.NrList.Nr1}
                                    className="form-control mystyle"
                                    onChange={this.nrChanged.bind(this,1)} />
                            </label>
                            <br/>
                            <label style={{paddingTop:'0px'}}>
                                <label className="my-label">Phone number 2:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.NrList.Nr2}
                                    className="form-control mystyle"
                                    onChange={this.nrChanged.bind(this,2)} />
                            </label>
                            <br/>
                            <label style={{paddingTop:'0px'}}>
                                <label className="my-label">Phone number 3:</label>
                                <input
                                    type="text"
                                    value={this.props.modemSettings.Modem.NrList.Nr3}
                                    className="form-control mystyle"
                                    onChange={this.nrChanged.bind(this,3)} />
                            </label>
                    </div>
                        <div className="col-6-lg col-md-6 col-sm-6 col-xs-6">

                            <button 
                                type="button"
                                className="btn btn-primary btn-work"
                                onClick={this.testNr.bind(this,1)} 
                                style={{height:"35px",marginTop:"26px", marginBottom:"26px"}}
                            ><label className="my-label">Test</label></button><br/>

                            <button 
                                type="button"
                                className="btn btn-primary btn-work"
                                style={{height:"35px", marginBottom:"26px"}}
                                onClick={this.testNr.bind(this,2)} 
                            ><label className="my-label">Test</label></button><br/>


                            <button 
                                type="button"
                                className="btn btn-primary btn-work"
                                onClick={this.testNr.bind(this,3)} 
                                style={{height:"35px"}}
                            ><label className="my-label">Test</label></button><br/>
                    </div>

            </div>
            </div>


        );
    }

    render() {


        if(this.props.wifiSettings == undefined || this.props.modemSettings.Modem == undefined) return <div/>;

        //console.log(this.props.modemSettings.Modem);
        return (
            <div className="container-fluid jumbotron mainFrame">
                <h3 style={{paddingLeft:"20px"}}> Wifi Settings </h3>
                <hr style={{padding:'10px',paddingBottom:"0px", margin:'0px'}} />

                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">

                    
                    <div className="row "> 
                        <div className="col-5-lg col-md-5 col-sm-12 col-xs-12" 
                        >

                        <label className="nameLabel"  style={{paddingTop:'10px'}}> WiFi </label>
                        <div className="col-lg-12 col-xs-12" 
                            style={{borderRadius:"5px",border:"1px solid #464545", paddingLeft:"30px"}}>

                            <Checkbox
                                label="Hide SSID"
                                checked={parseInt(this.props.wifiSettings.HideSSID)}
                                handler={this.hideSSIDChanged.bind(this)}
                                style={{marginTop:"25px"}}
                            />


                        <label style={{paddingTop:'10px'}}>
                            <label className="my-label"> AP name: </label>
                            <input
                                type="text"
                                value={this.props.wifiSettings.SSID}
                                className="form-control mystyle"
                                onChange={this.ssidChanged.bind(this)} />
                        </label><br/>


                        <label style={{paddingTop:'10px'}}>
                            <label className="my-label">AP password:</label>
                            <input
                                type="text"
                                value={this.props.wifiSettings.Passw}
                                className="form-control mystyle"
                                onChange={this.passChanged.bind(this)} />
                        </label><br/>

                        <label style={{paddingTop:'10px',paddingBottom:'20px', margin:"0px"}}>
                            <label className="my-label">Channel:</label>
                            <Select
                                name="form-field-name"
                                value={channelByVal(this.props.wifiSettings.Channel)}
                                options={ch_options}
                                onChange={this.chChanged.bind(this)}
                                searchable={false}
                                clearable={false}
                            />
                        </label>
                        <div className="visible-lg visible-md" style={{height:"109px"}}/>
                    </div>
                </div>

                {this.lte_widget()}
            </div>


            </div>
            <hr className="visible-xs"/>

            <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 twoSideButtons" style={{paddingTop:"50px"}}>
                <div className="col-lg-12 col-xs-6">
                    <Button
                        id={Buttons.Save}
                        label="Save"
                        icon="Save"
                        onClick={this.buttonClick.bind(this)}/>
                </div>

                <div className="col-lg-12 col-xs-6">
                    <Button
                        id={Buttons.MainMenu}
                        label="Back"
                        icon="Main_Menu"
                        onClick={this.buttonClick.bind(this)}/>
                </div>
            </div>
            </div>

        );
    }
};

