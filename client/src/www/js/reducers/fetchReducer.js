import store from "../store";

import { fetchStatus } from "../actions/fetchActions";

export function Status (state={
    data: {},
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    switch (action.type) {


        case "FETCH_STATUS": {
            return {...state, fetching: true}
        }
        case "FETCH_STATUS_FAILED": {
            return {...state, fetching:false, error: action.payload}
        }
        case "FETCH_STATUS_COMPLETED": {
            return {
                ...state,
                fetching:false,
                fetched: true,
                data: action.payload,
            }
        }


        default:
                return state;

    }
}





export function Log (state={
    data: {},
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    switch (action.type) {



        case "FETCH_LOG": {
            return {...state, fetching: true}
        }
        case "FETCH_LOG_COMPLETED": {
            return {
                ...state,
                fetching:false,
                fetched: true,
                data: action.payload,
            }
        }
        default:
                return state;

    }
}


export function Settings (state={
    data: {},
    fetching: false,
    fetched: false,
    error: null,
}, action) {

    switch (action.type) {



        case "FETCH_SETTINGS": {
            return {...state, fetching: true}
        }
        case "FETCH_SETTINGS_COMPLETED": {
            return {
                ...state,
                fetching:false,
                fetched: true,
                data: action.payload,
            }
        }
        case "SET_SETTINGS":
            return {
                ...state,
                fetching:false,
                fetched: true,
                data: action.payload,
            }
        default:
                return state;

    }
}




export function IOstate (state={
    data: {},
}, action) {

    switch (action.type) {
        case "IO_CONNECTED": {
            return {
                ...state,
                data: action.payload,
            }
        }
        default:
                return state;
    }
}

var timer1, timer2;

export function Login (state={
    data: {},
}, action) {

    switch (action.type) {
        case "LOGIN_COMPLETED": {
            //console.log(action.payload);

            if(action.payload.status == "0"){

                ////Ask for Txstatus every 1s
                //timer1 = setInterval(function(){
                    //store.dispatch(fetchTxStatus());
                //}.bind(this),400);

                //Ask for Rxstatus every 1s
                timer2 = setInterval(function(){ 
                    store.dispatch(fetchStatus());
                }.bind(this),800);

            }

            if(action.payload.status == "5"){
                clearInterval(timer1);
                clearInterval(timer2);
            }
            return {
                ...state,
                data: action.payload,
            }
        }
        default:
            return state;
    }
}

export function userAlreadyConnected (state=false, action) {

    switch (action.type) {
        case "FETCH_USER_ALREADY_CONNECTED": {
            return action.payload
        }
        default:
                return state;
    }
}

