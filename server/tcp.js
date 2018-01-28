"use strict;"

const EventEmitter = require('events');
//const util = require('util')
const net = require('net');
const parseString = require('xml2js').parseString;
const jstoxml = require('jstoxml');

const emitter = new EventEmitter();
var connected = false;
var firstChunk = true;
var dataLength = 0;
const clientSocket = new net.Socket();
var Ip
var Port


var accumulatingBuffer = new Buffer(0); 
var totalPacketLen   = -1; 
var accumulatingLen  =  0;
var recvedThisTimeLen=  0;
const packetHeaderLen = 8;



//Tcp packet structure
var TcpPacket = {
    TCPpacket:{
        Sender:"Remote", 
        Command:" ",
        Object:" ",
        Status:" ",
        Error:" ",
        Data:" "
    }}


//connect to tcp server
var listen = function(port,ip) {

    console.log("[TCP] connecting to " + ip + ":" + port);
    //clientSocket = new net.createConnection(port,ip)
    //clientSocket.setKeepAlive(true);
    clientSocket.setNoDelay(true)
    clientSocket.connect(port,ip);
    Ip = ip;
    Port = port;
};





clientSocket.on('connect', function() {
    //device.connected();
    console.log("[TCP] Connected to " + Ip + ":" + Port);
})





clientSocket.on('close', function(Data) {

    connected = false;
    clientSocket.destroy();

    accumulatingBuffer = new Buffer(0); 
    totalPacketLen   = -1; 
    accumulatingLen  =  0;
    recvedThisTimeLen=  0;

    console.log("[ERROR] Socket closed!");
    clientSocket.setTimeout(10000, function() {
        console.log('[TCP] trying to reconnect')
        //clientSocket = new net.createConnection(port,ip)
        clientSocket.connect(Port,Ip);
    })
})




clientSocket.on('error', function(err) {
    if (err.code == "ENOTFOUND") {
        console.log("[ERROR] No device found at this address!");
    }

    if (err.code == "ECONNREFUSED") {
        console.log("[TCP] Connection refused! Please check the IP.");
    }

    console.log("[TCP]" +err.message);

})




clientSocket.on('disconnect', function() {
    console.log("[TCP] disconnected!");
    connected = false;

});




//data from tcp server received
//client.on('data', function(Data) {

clientSocket.on('data', function(Data) {
    //Check first string
    if (connected == false){
        if(Data.compare(new Buffer("Indigma 2 v1.0\n"))){
            connected = true;
        };
    }
    else{

        parseTcpData(Data);

    }
})


var parseTcpData = function(data){

    //this packaet size
    recvedThisTimeLen = data.length;

    //accumulate incoming data
    var tmpBuffer = new Buffer( accumulatingLen + recvedThisTimeLen );
    accumulatingBuffer.copy(tmpBuffer);


    data.copy ( tmpBuffer, accumulatingLen  ); // offset for accumulating
    accumulatingBuffer = tmpBuffer; 
    tmpBuffer = null;
    accumulatingLen += recvedThisTimeLen ;
    //console.log('accumulatingBuffer = ' + accumulatingBuffer  ); 
    //console.log('accumulatingLen    =' + accumulatingLen );

    if( recvedThisTimeLen < packetHeaderLen ) {
        //console.log('need to get more data(less than header-length received) -> wait..');
        return;
    } else if( recvedThisTimeLen == packetHeaderLen ) {
        //console.log('need to get more data(only header-info is available) -> wait..');
        return;
    } else {
        //console.log('before-totalPacketLen=' + totalPacketLen ); 
        //a packet info is available..
        if( totalPacketLen < 0 ) {
            //4 bytes data size and 4 bytes xml data size. in webgui always the same
            totalPacketLen = (accumulatingBuffer.slice(0,4)).readUInt32BE(0); 
            //console.log('totalPacketLen=' + totalPacketLen );
        }
    }    

    //in case of the accumulatingBuffer has multiple 'header and message'.
    while( accumulatingLen >= totalPacketLen + packetHeaderLen ) {
        //console.log( 'accumulatingBuffer= ' + accumulatingBuffer );

        var aPacketBufExceptHeader = new Buffer( totalPacketLen  ); // a whole packet is available...
        //console.log( 'aPacketBufExceptHeader len= ' + aPacketBufExceptHeader.length );
        accumulatingBuffer.copy( aPacketBufExceptHeader, 0, packetHeaderLen, accumulatingBuffer.length); // 

        //process one packet data
        //call handler
        parse(aPacketBufExceptHeader);

        //rebuild buffer
        var newBufRebuild = new Buffer( accumulatingBuffer.length );
        newBufRebuild.fill();
        accumulatingBuffer.copy( newBufRebuild, 0, totalPacketLen + packetHeaderLen, accumulatingBuffer.length  );

        //init      
        accumulatingLen -= (totalPacketLen + packetHeaderLen) ;
        accumulatingBuffer = newBufRebuild;
        newBufRebuild = null;
        totalPacketLen = -1;
        //console.log( 'Init: accumulatingBuffer= ' + accumulatingBuffer );   
        //console.log( '      accumulatingLen   = ' + accumulatingLen );  

        if( accumulatingLen <= packetHeaderLen ) {
            return;
        } else {
            totalPacketLen = accumulatingBuffer.readUInt32BE(0) ; 
            //console.log('totalPacketLen=' + totalPacketLen );
        }    
    }  
}


//add data size header and send data to socket
var write = function(data) {

    if(clientSocket.writable){
        length = Buffer.byteLength(data)
        // 4 bytes = 32 bits
        buffer = new Buffer(4 + Buffer.byteLength(data));
        buffer.writeUInt32BE(length);
        buffer.write(data, 4);
        clientSocket.write(buffer)
    }

}

var handleStatus = function(data){

    if(data.Status != "Ok"){
        console.log("----- Error : "+data.Error+" -----");
    }

}

//parse xml data
var parse = function(data){


    parseString(data, {trim: true, explicitArray: false},function (err, result) {

        if(err){
            console.log("[TCP] Xml parse err");
            //console.log(err);
            return;
        }
        //console.log("----------"+result.TCPpacket.Command);
        //console.log(util.inspect(result, {depth: null, colors: true}))
        if(result.TCPpacket.Command == "ResponseToSet"){
            handleStatus(result.TCPpacket);
        }
        else {
            //Get data portion
            var Data =  result.TCPpacket.Data[result.TCPpacket.Object];
            //console.log(util.inspect(Data, {depth: null, colors: true}))
            emitter.emit('data',result.TCPpacket.Object,Data)
        }
    });

}

//send request to tcp server
var SendRequest = function(req){

    //console.log(req);
    if(!connected) return
    var obj = req.object;
    TcpPacket.TCPpacket.Object = obj;
    TcpPacket.TCPpacket.Command = req.cmd;
    TcpPacket.TCPpacket.Data = {[obj]:req.data} || 0;

    //generate xml
    var xml = jstoxml.toXML(TcpPacket, {header: false, indent: ' '});
    //send xml doc
    write(xml);
    //console.log(xml);

}



module.exports.SendRequest = SendRequest
module.exports.emitter = emitter
module.exports.listen = listen
