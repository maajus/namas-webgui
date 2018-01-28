"use strict;"

var currentUser ="";
var currentSocket;
var PcUser = false;

module.exports = function(server,ip) {

    const tcp = require("./tcp");
    const tcp_audio = require("./tcp_audio");
    const io = require('socket.io')(server,{log:false});
    //const indigma_ip = '192.168.0.234';

    //io.set('heartbeat interval', 70);
    //io.set('heartbeat timeout', 30);

    // or
    //io.set('transports', ['websocket']);
    //io.set('transports', ['websocket', 'flashsocket', 'htmlpage', 'xhr-polling', 'jsonp-polling', ]);

    io.on('connection', function(socket){
        console.log('[SIO] User connected. IP:' + socket.handshake.address);
        const users = Object.keys(io.sockets.sockets).length;
        console.log('[SIO] Connected users: ' + users);

        if(PcUser){
            //io.sockets.socket(socket.id).emit("UserAlreadyConnected",true);
            socket.emit("UserAlreadyConnected",true);
            socket.disconnect(true);
            console.log("[SIO] PC user is connected");
            return;
        }

        var tempIP;
        if(socket.handshake.address.length > 15)
            tempIP = socket.handshake.address.slice(7);
        else
            tempIP = socket.handshake.address;

        if(users > 1 && tempIP != currentUser) {
            //io.sockets.socket(socket.id).emit("UserAlreadyConnected",true);
            socket.emit("UserAlreadyConnected",true);
            socket.disconnect(true);
            console.log("[SIO] Another user connected: "+ currentUser);
        }
        else{

            if(tempIP == currentUser){
                currentSocket.disconnect(true);
            }

            currentUser = tempIP;
            currentSocket=socket;

            msg = { 
                cmd:"Set", 
                object:"WebUsers",
                data: {ip:currentUser, connected:1}
            };
            tcp.SendRequest(msg);
        }


        socket.on('req', function(msg){
            tcp.SendRequest(msg);
        });

        socket.on('audio_data', function(msg){
            tcp_audio.listen(65112,ip);
        });

        socket.on('disconnect', function(){
            console.log("[SIO] User disconnected");
            msg = { 
                cmd:"Set", 
                object:"WebUsers",
                data: {ip:currentUser, connected:0}
            };
            tcp.SendRequest(msg);
        });



    });

    //received obj data from rx
    tcp.emitter.on('data',function(obj,data){

        if(obj=="PcUserConnected"){
            PcUser = true;
            console.log("[SIO] PC user connected");
        }
        if(obj=="PcUserNotConnected"){
            PcUser = false;
            console.log("[SIO] PC user disconnected");
        }



        io.emit(obj,data);

    })

    //getting audio data 
    tcp_audio.emitter.on('data',function(data){

        //console.log(data);
        io.emit("audio_data",data);

    })

};
