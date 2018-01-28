"user strict;"

import React from "react";
import Button from "../components/Button";
import Switch from "../components/Switch";
//import Display from "../pages/RxSettings/Display";
import Date from "../pages/RxSettings/Date";
//import Storage from "../pages/RxSettings/Storage";
import System from "../pages/RxSettings/System";
import Lang from "../pages/RxSettings/Lang";
//import USB from "../pages/RxSettings/USB";
import RC from "../pages/RxSettings/RC";

import { connect } from "react-redux"

import { fetchRxSettings } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { setRxSettings } from "../actions/fetchActions";



var Buttons = {
    Save:0,
    MainMenu:1,
}



@connect((store) => {

    return {
        rxSettings: store.RxSettings.data,
    };
})


export default class RxSettings extends React.Component {

    constructor(props){
        super(props);
        this.data = {};
        this.state = {win:"date"};
    };

    componentDidMount(){

        this._isMounted = true;
        this.props.dispatch(fetchRxSettings());
    }


    componentWillUnmount(){
        this._isMounted = false;
    }

    componentWillReceiveProps(newProps){

        //console.log(newProps);

        if(newProps.rxSettings != undefined){
            this.data = newProps.rxSettings;
        }

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
        if(!this.ValidateIPaddress(this.data.Ethernet.IP))
            this.data.Ethernet.IP="";
        if(!this.ValidateIPaddress(this.data.Ethernet.Mask))
            this.data.Ethernet.Mask="";
        if(!this.ValidateIPaddress(this.data.Ethernet.Gateway))
            this.data.Ethernet.Gateway="";
        if(!this.ValidateIPaddress(this.data.Ethernet.DNS1))
            this.data.Ethernet.DNS1="";
        if(!this.ValidateIPaddress(this.data.Ethernet.DNS2))
            this.data.Ethernet.DNS2="";

        if(!macregex.test(this.data.Ethernet.MAC))
            this.data.Ethernet.MAC = "";



        this.props.dispatch(sendCommand("Set","RxSettings",this.data));
        //console.log(this.data);

    }

    //return child depending on query string
    switchSubwindow(){

        //console.log(this.props);
        //console.log(this.props.location.query);
        var display = {backlight_level:this.props.rxSettings.backlight_level,
            backlight_dim_timeout:this.props.rxSettings.backlight_dim_timeout,
            backlight_off_timeout:this.props.rxSettings.backlight_off_timeout}

        switch(this.state.win){
            case "display":
                break;
                //return (<Display data={display} callback={this.displayCallback.bind(this)}/>)
            case "date":
                return ( <Date 
                    data={this.props.rxSettings.CurrentTime} 
                    refresh={this.refresh.bind(this)}
                /> )

            //case "storage":
                //return <Storage 
                    //refresh={this.refresh.bind(this)}
                ///>

            case "system":
                return <System 
                    version={this.props.rxSettings.Version} 
                />

            case "lang":
                return <Lang 
                    data={this.props.rxSettings.language} 
                    callback={this.langCallback.bind(this)}
                />

            //case "usb":
                //return <USB 
                    //data={this.props.rxSettings.usb_slave} 
                    //callback={this.usbCallback.bind(this)}
                ///>

            case "rc":
                return <RC
                    data={this.props.rxSettings.rc} 
                    callback={this.rcCallback.bind(this)}
                    />


        }

    }

    refresh(){

        this.props.dispatch(fetchRxSettings());
    }

    displayCallback(val){

        this.data.backlight_level = val.backlight_level;
        this.data.backlight_off_timeout = val.backlight_off_timeout;
        this.data.backlight_dim_timeout = val.backlight_dim_timeout;
        //this.refresh();
    }
    
    langCallback(val){
        this.data.language = val;
        //this.refresh();
    }
    usbCallback(val){
        this.data.usb_slave = val;
        //this.refresh();
    }
    rcCallback(val){
        this.data.rc = val;
        //this.refresh();
    }
    menu_click(val){

        this.setState({win:val});

    }


    render() {

        //console.log(this.props.rxSettings);

        var style = {[this.state.win]:"active"};

        return (
            <div className="container-fluid jumbotron mainFrame">
                <h3> RX Settings </h3>
                <hr style={{padding:'10px', margin:'0px'}} />


                <div className="col-lg-2 col-md-2">
                    <ul className="nav nav-pills nav-stacked">
                        <li><a 
                                className={"btn btn-primary " +style.date} 
                                onClick={this.menu_click.bind(this,"date")}
                            >Date & Time
                        </a></li>
                        <li><a 
                                className={"btn btn-primary " +style.system} 
                                onClick={this.menu_click.bind(this,"system")}
                            >System</a></li>
                        <li><a 
                                className={"btn btn-primary " +style.lang} 
                                onClick={this.menu_click.bind(this,"lang")}
                            >Language</a></li>
                        <li><a 
                                className={"btn btn-primary " +style.rc} 
                                onClick={this.menu_click.bind(this,"rc")}
                            >Keyfob
                        </a></li>
                    </ul>
                </div>
                <hr className="visible-xs visible-sm"/>
                <div className="col-lg-8 col-md-8" style={{padding:"mpx"}}>
                    {this.switchSubwindow()}
                </div>

                <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12">
                <hr className="visible-xs visible-sm visible-md"/>
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

