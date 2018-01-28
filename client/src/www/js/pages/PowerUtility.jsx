"use strict;"

import React from "react";
import Button from "../components/Button";
import { connect } from "react-redux"

import { sendCommand } from "../actions/fetchActions";
import { fetchPowerStatus } from "../actions/fetchActions";

var Buttons = {
    MainMenu:0,
    Refresh:1,
}


var td_style = {
    paddingTop: '.5em',
    paddingBottom: '.5em',
    textAlign:'left',
    width:'200px'
}


var td_style_value = {
    paddingTop: '.5em',
    paddingBottom: '.5em',
    textAlign:'left',
    fontWeight:"bold",
    width:'220px'
}


//suscribe to redux store
@connect((store) => {

    return {
        PowerStatus:store.PowerStatus.data,
    };
})




export default class PowerUtility extends React.Component {

    componentDidMount(){

        this.props.dispatch(fetchPowerStatus());
        this.intervalId = setInterval(function(){
            this.props.dispatch(fetchPowerStatus());
        }.bind(this), 5000);

    }

    componentWillUnmount(){
        clearInterval(this.intervalId);
    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.MainMenu:
                this.props.route.history.push('/');
                break;
            case Buttons.Refresh:
                this.refreshList();
                break;


            default:
                console.log("No such button");
        }

    };

    refreshList(){
        this.props.dispatch(fetchPowerStatus());
    }

    resetExtCapacity(){
            this.props.dispatch(sendCommand("Set","CommandToRx", {ResetExtCapacity:1}));
    }


    render() {

        let power = Math.round(this.props.PowerStatus.Bat_current * this.props.PowerStatus.Bat_voltage / 1000);
        let ext_state ="N/A";
        let ext_power, ext_voltage, ext_current, ext_capacity, ext_full_capacity="N/A", ext_percent,bat_time;
        let ac="N/A";

        if(this.props.PowerStatus.AC=="1")
            ac="AC";
        else
            ac="Battery";

        if(this.props.PowerStatus.Ext_state == "1"){
            ext_state = "Connected";
            ext_capacity = this.props.PowerStatus.Ext_capacity + " mAh";

            if(parseInt(this.props.PowerStatus.Ext_current) >= 0){
                ext_current = this.props.PowerStatus.Ext_current + " mA";
                ext_voltage = this.props.PowerStatus.Ext_voltage + " mV";
                ext_power = Math.round(this.props.PowerStatus.Ext_voltage*this.props.PowerStatus.Ext_current/1000).toString()+" mW";
            }else{
                ext_current = "N/A";
                ext_voltage = "N/A";
                ext_capacity = "N/A";
                ext_power = "N/A";
            }
        }
        else{
            ext_state = "Not connected";
            ext_capacity = "N/A";
            ext_current = "N/A";
            ext_voltage = "N/A";
            ext_capacity = "N/A";
            ext_power = "N/A";
        }


        if(this.props.PowerStatus.Bat_time == "0")
            bat_time = "-";
        else
            bat_time = this.props.PowerStatus.Bat_time;

        return (
            <div className="container-fluid jumbotron mainFrame" >
                <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                    <h3> Power Utility </h3>
                    <hr style={{marginTop:'5px'}} />

                    <div className="powerUtility" >



                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label className="my-label" style={{fontWeight:"bold",marginBottom:"5px"}}> RX Battery </label>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                            style={{height:"340px",borderRadius:"5px",border:"1px solid #464545"}}>
                            <div style={{height:"10px"}}/>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td style={td_style} className="my-label">Level: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_level}%</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Power: </td>
                                        <td style={td_style_value} className="my-label">{power} mW</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Source: </td>
                                        <td style={td_style_value} className="my-label">{ac}</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Voltage: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_voltage} mV</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Current: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_current} mA</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Temp: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_temp/10} °C</td>

                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Cycles: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_cycles}</td>

                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">NAC: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_nac} mAh</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Full: </td>
                                        <td style={td_style_value} className="my-label">{this.props.PowerStatus.Bat_capacity} mAh</td>
                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Time: </td>
                                        <td style={td_style_value} className="my-label">{bat_time} min</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        </div>


                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visible-xs" style={{height:"15px"}}/>

                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <label className="my-label" style={{fontWeight:"bold",marginBottom:"5px"}}>External Battery </label>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                            style={{height:"100%",borderRadius:"5px",border:"1px solid #464545"}}>
                            <div style={{height:"10px"}}/>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td style={td_style} className="my-label" >State: </td>
                                        <td style={td_style_value} className="my-label">{ext_state}</td>

                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Power: </td>
                                        <td style={td_style_value} className="my-label">{ext_power}</td>

                                    </tr>
                                    <tr>

                                        <td style={td_style} className="my-label">Voltage: </td>
                                        <td style={td_style_value} className="my-label">{ext_voltage}</td>

                                    </tr>
                                    <tr>

                                        <td style={td_style} className="my-label">Current: </td>
                                        <td style={td_style_value} className="my-label">{ext_current}</td>

                                    </tr>
                                    <tr>
                                        <td style={td_style} className="my-label">Capacity: </td>
                                        <td style={td_style_value} className="my-label">{ext_capacity}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div  style={{paddingBottom:"20px"}}>
                        <button
                            type="button"
                            className="btn btn-primary my-button"
                            onClick={this.resetExtCapacity.bind(this)}>
                            Reset capacity <br/> counter
                        </button>
                        </div>



                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 visible-lg visible-md"
                                style={{height:"52px"}}/>


                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 visible-sm"
                                style={{height:"97px"}}/>


                        </div>
                        </div>

                    </div>
                </div>



                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 twoSideButtons">
                    <div className="col-lg-12 col-xs-6">
                        <Button id={Buttons.Refresh} label="Refresh" icon="Refresh"  onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-lg-12 col-xs-6">
                        <Button id={Buttons.MainMenu} label="Main Menu" icon="Main_Menu"  onClick={this.buttonClick.bind(this)}/>
                    </div>

                </div>

            </div>
        );
    }
};

