'use strict;'

import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import NoCon from "../pages/NoConnection";
import LoginPage from "../pages/Login";
import cookie from "cookie";

import { fetchDownloadStatus } from "../actions/fetchActions";
import { connect } from "react-redux";
import { login } from "../actions/fetchActions";

@connect((store) => {

    return {
      loginStatus: store.Login.data.status,
      IOstate: store.IOstate.data.status,
};
})

export default class Layout extends React.Component {

    constructor(props) {

        super(props);

    };


    componentWillReceiveProps(newProps){


    }


    //show no connection win instead of child win
    NoConShow(){


        if(this.props.IOstate == "0" && (this.props.loginStatus == "0"))
            return <NoCon text="No connection with RX"/>;

        if(this.props.loginStatus != "0")
            return <LoginPage/>;

        return this.props.children;
    }

    topBar(){

        if(this.props.loginStatus != "0") return null;
        return(<TopBar history={this.props.route.history}/>);

    }

    render() {

        return (
            <div className="container my-container">
                {this.topBar()}
                <div>{this.NoConShow()}</div> 
                <BottomBar/>
            </div>
        );
    }
};


