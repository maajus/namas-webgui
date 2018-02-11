"use strict;"

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import { Provider } from "react-redux"
import store from "./store"

import Layout from "./components/Layout";
import Main from "./pages/Main";

//import Tx_win from "./pages/Tx_win";
//import Log from "./pages/Log";
//import Wifi from "./pages/Wifi";
import System from "./pages/Settings/System"
import Livingroom from "./pages/Livingroom"
import Bedroom from "./pages/Bedroom"
import Corridor from "./pages/Corridor"
import Workroom from "./pages/Workroom"
import Bathroom from "./pages/Bathroom"
//import Network_win from "./pages/Network_win"
//import TxSettings from "./pages/TxSettings"
//import Timerpad from "./pages/Timerpad"
//import TxTimers from "./pages/TxTimers"
//import RxTimers from "./pages/RxTimers"
//import RxRecords from "./pages/RxRecords"
//import TxRecords from "./pages/TxRecords"
//import Online from "./pages/Online"
//import Download from "./pages/Download"
//import ContDownload from "./pages/ContDownload"
//import RfTest from "./pages/RfTest"
//import PowerUtility from "./pages/PowerUtility"
//import WifiSettings from "./pages/WifiSettings"
//import VoxLevels from "./pages/VoxLevels"


const app = document.getElementsByClassName('mainDiv')[0];

ReactDOM.render(
    <Provider store={store}>
    <Router history={hashHistory}>
        <Route path="/" component={Layout} history={hashHistory}>
            <IndexRoute  component={Main} history={hashHistory}/>
            <Route path="main" component={Main} history={hashHistory}/>
            <Route path="settings" component={System} history={hashHistory}/>
            <Route path="livingroom" component={Livingroom} history={hashHistory}/>
            <Route path="bedroom" component={Bedroom} history={hashHistory}/>
            <Route path="corridor" component={Corridor} history={hashHistory}/>
            <Route path="workroom" component={Workroom} history={hashHistory}/>
            <Route path="bathroom" component={Bathroom} history={hashHistory}/>
        </Route>
    </Router>
    </Provider>,
app);


