"user strict;"

import React from "react";
import Button from "../components/Button";
import Switch from "../components/Switch";
import System from "../pages/Settings/System";

import { connect } from "react-redux"

import { fetchSettings } from "../actions/fetchActions";
import { sendCommand } from "../actions/fetchActions";
import { setSettings } from "../actions/fetchActions";


var Buttons = {
    Save:0,
    MainMenu:1,
}



@connect((store) => {

    return {
        Settings: store.Settings.data,
    };
})


export default class Settings extends React.Component {

    constructor(props){
        super(props);
        this.data = {};
        this.state = {win:"system"};
    };

    componentDidMount(){

        this._isMounted = true;
        this.props.dispatch(fetchSettings());
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



    sendData(){


        this.props.dispatch(sendCommand("Set","Settings",this.data));
        //console.log(this.data);

    }

    //return child depending on query string
    switchSubwindow(){

        //console.log(this.props);
        //console.log(this.props.location.query);

        switch(this.state.win){
            case "system":
                return <System 
                />
        }

    }

    menu_click(val){

        this.setState({win:val});

    }

    render() {

        //console.log(this.props.rxSettings);

        var style = {[this.state.win]:"active"};

        return (
            <div className="container-fluid jumbotron mainFrame">
                <h3> Settings </h3>
                <hr style={{padding:'10px', margin:'0px'}} />


                <div className="col-lg-2 col-md-2">
                    <ul className="nav nav-pills nav-stacked">
                       <li><a 
                                className={"btn btn-primary " +style.system} 
                                onClick={this.menu_click.bind(this,"system")}
                            >System</a></li>
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

