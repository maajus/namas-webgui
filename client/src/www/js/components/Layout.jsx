'use strict;'

import React from "react";
import TopBar from "./TopBar";
//import BottomBar from "./BottomBar";
//import NoCon from "../pages/NoConnection";
import LoginPage from "../pages/Login";
//import cookie from "cookie";

import { fetchDownloadStatus } from "../actions/fetchActions";
import { connect } from "react-redux";
import { login } from "../actions/fetchActions";


var home_icon = require('url!../../images/home.png');
var settings_icon = require('url!../../images/settings.png');


@connect((store) => {

    return {
      loginStatus: store.Login.data.status,
      IOstate: store.IOstate.data.status,
};
})

export default class Layout extends React.Component {

    constructor(){
        super();
        this.state = {win:"main"};
    }

    topBar(){

        return(<TopBar history={this.props.route.history}/>);

    }



    //return child depending on query string
    switchSubwindow(){
        return this.props.children;
        //console.log(this.props);
        //console.log(this.props.location.query);

        //switch(this.state.win){
            //case "system":
                //return <System 
                ///>
        //}

    }


    menu_click(win){

        this.props.route.history.push('/'+win);

    }


    Login(){


        if(this.props.loginStatus != "0")
            return <LoginPage/>


        return(
            <div className="container-fluid jumbotron mainFrame">
                <div className="col-lg-2 col-md-2" style={{textAlign:"center",paddingTop:"40px"}}>

                    <ul className="">

                        <li style={{paddingTop:"20px"}}>
                            <a onClick={this.menu_click.bind(this,"main")} >
                                <img src={home_icon} style={{marginRight:'1px'}}   width="80px" />
                        </a></li>

                        <li style={{paddingTop:"20px"}}>
                            <a onClick={this.menu_click.bind(this,"settings")} >
                                <img src={settings_icon} style={{marginRight:'1px'}}   width="80px" />
                        </a></li>


                    </ul>

                </div>
                <hr className="visible-xs visible-sm"/>
                <div className="col-lg-10 col-md-10" style={{padding:"mpx"}}>
                    {this.switchSubwindow()}
                </div>
            </div>
            );

    }



    render() {

        var style = {[this.state.win]:"active"};

        return (
            <div className="container my-container">
                {this.topBar()}
                {this.Login()}


            </div>
        );
    }
};


