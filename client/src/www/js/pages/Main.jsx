"use strict;"
import React from "react";
import Button from "../components/Button";

import { connect } from "react-redux"
import { getRxConfig } from "../actions/fetchActions";
import { Mode } from "../modules/Constants.js";
import { sendCommand } from "../actions/fetchActions";


var Buttons = {
    Corridor: 1,
    Bathroom: 2,
    Bedroom: 3,
    Livingroom: 4,
    Workroom: 5,
    AllLightsON: 6,
    AllLightsOFF: 7,
    Log: 8,
    Settings: 9,
}


@connect((store) => {

    return {
        status:store.Status.data,
    };
})



export default class Main extends React.Component {

    constructor(){
        super();
    }

    componentDidMount(){

        this.props.dispatch(sendCommand("Get", "Status", ""));
    }

    componentWillReceiveProps(nextProps){

        console.log(nextProps.status);
    }


    //called by button childs
    buttonClick(id){

        switch(id){
            case Buttons.Corridor:
                this.props.route.history.push('/tx_win?mode=corridor');
                break;
            case Buttons.Bathroom:
                this.props.route.history.push('/tx_win?mode=bathroom');
                break;
            case Buttons.Bedroom:
                this.props.route.history.push('/tx_win?mode=bedroom');
                break;
            case Buttons.Workroom:
                this.props.route.history.push('/tx_win?mode=workroom');
                break;
            case Buttons.Livingroom:
                this.props.route.history.push('/tx_win?mode=livingroom');
                break;
            case Buttons.Log:
                this.props.route.history.push('/log');
                break;
            case Buttons.AllLightsON:
                this.switchAllLights(true);
                break;
            case Buttons.AllLightsOFF:
                this.switchAllLights(false);
                break;
            case Buttons.Settings:
                this.props.route.history.push('/settings');
                break;

            default:
                console.log("No such button: "+id);
        }

    }

    switchAllLights(enable){

        this.props.dispatch(sendCommand("Set", "Command", {SwitchAllLights:enable? "1":"0"}));
    }


    render() {

        var col_class = "col-md-2 col-sm-4 col-xs-4";

        return (
            <div className="container-fluid jumbotron mainFrame">

                    <div className={col_class} >
                        <Button id={Buttons.AllLightsON}
                            label="Įjungti visas šviesas"
                            icon="Download_Mode"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className={col_class} >
                        <Button id={Buttons.AllLightsOFF}
                            label="Išjungti visas šviesas"
                            icon="Download_Mode"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className={col_class} >
                        <Button id={Buttons.Settings}
                            label="Settings"
                            icon="Download_Mode"
                            onClick={this.buttonClick.bind(this)}/>
                    </div>



                </div>
        );
    }
};


