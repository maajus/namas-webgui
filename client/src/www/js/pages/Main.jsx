"use strict;"
import React from "react";
import Info from "../components/Info";

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
                this.props.route.history.push('/corridor');
                break;
            case Buttons.Bathroom:
                this.props.route.history.push('/bathroom');
                break;
            case Buttons.Bedroom:
                this.props.route.history.push('/bedroom');
                break;
            case Buttons.Workroom:
                this.props.route.history.push('/workroom');
                break;
            case Buttons.Livingroom:
                this.props.route.history.push('/livingroom');
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

        var col_class = "col-lg-4 col-md-4 col-sm-4";

        return (
            <div style={{paddingTop:"30px"}} >

            <div className="row" >
                    <div className={col_class} >
                        <Info id={Buttons.Livingroom}
                            label="Svetaine"
                            data={this.props.status.Livingroom}
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className={col_class} >
                        <Info id={Buttons.Bedroom}
                            label="Miegamasis"
                            data={this.props.status.Bedroom}
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className={col_class} >
                        <Info id={Buttons.Bathroom}
                            label="Vonia"
                            data={this.props.status.Bathroom}
                            onClick={this.buttonClick.bind(this)}/>
                    </div>
                    </div>

            <div className="row" style={{paddingTop:"30px"}} >
                    <div className="col-xs-4" >
                        <Info id={Buttons.Workroom}
                            label="Darbo kambarys"
                            data={this.props.status.Workroom}
                            onClick={this.buttonClick.bind(this)}/>
                    </div>

                    <div className="col-xs-4" >
                        <Info id={Buttons.Corridor}
                            label="Koridorius"
                            data={this.props.status.Corridor}
                            onClick={this.buttonClick.bind(this)}/>
                    </div>
                    <div className="col-xs-4" />

                    </div>


                </div>
        );
    }
};


