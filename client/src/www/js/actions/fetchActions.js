import io from 'socket.io-client';
import store from "../store";


let socket = io.connect(process.env.SOCKET_URL, {forceNew:true,transports: ['websocket', 'polling']});
socket.io.reconnectionAttempts(5);
//manager.timeout(500);

// Reconnects on disconnection
socket.on('disconnect', function(){
    console.log("[IO] Disconnected");
    store.dispatch({type: "IO_CONNECTED", payload:{status:"0"}})

});

socket.on('connect', function(){
    console.log("[IO] Connected");
    store.dispatch({type: "IO_CONNECTED", payload:{status:"1"}})
});

//socket.on('reconnect_attempt', function(){
    //console.log("[IO] RECONNECTING");
//});

socket.on('reconnect_failed', function(){
    console.log("[IO] Reconnect failed ");
    store.dispatch({type: "IO_CONNECTED", payload:{status:"0"}})
});

//socket.on('reconnect_error', function(error){
    //console.log("[IO] Reconnect error "+error);
//});

//socket.on('error', function(error){
    //console.log("[IO] Error "+error);
//});

//socket.on('connect_error', function(error){
    //console.log("[IO] Connect error "+error);
//});

socket.on('connect_timeout', function(timeout){
    console.log("[IO] Timeout "+timeout);
});

socket.on('Login', function(msg){
    store.dispatch({type: "LOGIN_COMPLETED", payload:msg})
})


export function logout() {

    return function(dispatch) {

        dispatch({type: "LOGIN_COMPLETED", payload:{username:"-1",status:"5"}})
        socket.emit('req', {cmd: "Get", object: "Login", data:{username:"-1", pass:"-1", token:"-1"}});
    }
    
}

export function login(user,pass,token) {
    return function(dispatch) {

        var Login = {username:user, pass:pass, token:token};
        dispatch({type: "LOGIN", payload:Login})
        socket.emit('req', {cmd: "Get", object: "Login", data:Login});

    }
}


export function fetchSettings() {
    return function(dispatch) {

        socket.emit('req', {cmd: "Get", object: "Settings"});
        dispatch({type: "FETCH_SETTINGS"})

        socket.on('Settings', function(msg){
            dispatch({type: "FETCH_SETTINGS_COMPLETED", payload:msg})
        })
    }
}

export function fetchStatus() {
    return function(dispatch) {

        socket.emit('req', {cmd: "Get", object: "Status"});
        dispatch({type: "FETCH_STATUS"})

        socket.on('Status', function(msg){
            dispatch({type: "FETCH_STATUS_COMPLETED", payload:msg})
        })
    }
}



export function setSettings(data) {
    return function(dispatch) {

            dispatch({type: "SET_SETTINGS", payload:data})
    }
}



export function fetchLog() {
    return function(dispatch) {

        socket.emit('req', {cmd: "Get", object: "Log"});
        dispatch({type: "FETCH_LOG"})

        socket.on('Log', function(msg){
            if(msg != null)
            dispatch({type: "FETCH_LOG_COMPLETED", payload:msg})
        })

    }
}



export function sendCommand(cmd, object, data){

    return function(dispatch) {
        socket.emit('req', {cmd: cmd, object: object, data:data});
        dispatch({type: "SEND_CMD", payload:{cmd:cmd,object:object, data:data}})

}
}




