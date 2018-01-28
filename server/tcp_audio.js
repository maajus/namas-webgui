const EventEmitter = require('events');
var net = require('net');

var emitter = new EventEmitter();
var client;
var connected = false;
var port;
var ip;
var con_tries = 0;


var accumulatingBuffer = new Buffer(0); 
var totalPacketLen   = -1; 
var accumulatingLen  =  0;
var recvedThisTimeLen=  0;
var packetHeaderLen = 4;



//connect to tcp server
var listen = function(Port,Ip) {

    ip = Ip;
    port = Port;
    //client.connect(port, ip, function() {
        //console.log("Connected to audio port");
    //})

    openConnection(port,ip,3000);

};



var openConnection = function(port, ip, timeout) {
    var timer;
    timeout = timeout || 2000;
    try {
        console.log("[TCP AUDIO] connecting to " + ip + ":" + port);
        client = new net.createConnection(port,ip)
        client.setNoDelay(true)

            .on('connect', function() {
                clearTimeout(timer);
                con_tries = 0;
                //device.connected();
                console.log("[TCP AUDIO] Connected to " + ip + ":" + port);
            })
            .on('data', function(Data) {
                clearTimeout(timer);
                DataReceived(Data);
            })
            .on('error', function(err) {
                clearTimeout(timer);
                if (err.code == "ENOTFOUND") {
                    console.log("[TCP AUDIO] No device found at this address!");
                    client.destroy();
                    return;
                }

                if (err.code == "ECONNREFUSED") {
                    console.log("[TCP AUDIO] Connection refused! Please check the IP.");
                    con_tries++;
                    if(con_tries > 7){
                        con_tries = 0;
                        return;
                    }
                    //client.destroy();
                    client.setTimeout(4000, function() {
                        client.destroy();
                        openConnection(port,ip, 3000);
        });
                    return;
                }


                console.log("[TCP AUDIO] Unexpected error! " + err.message + "     RESTARTING SERVER");
                clearTimeout(timer);


            })
            .on('disconnect', function() {
                console.log("[TCP AUDIO] disconnected!");

                accumulatingBuffer = new Buffer(0); 
                totalPacketLen   = -1; 
                accumulatingLen  =  0;
                recvedThisTimeLen=  0;
                packetHeaderLen = 4;

            });
        timer = setTimeout(function() {
            console.log("[TCP AUDIO] Error. Attempt at connection exceeded timeout value");
            client.end();
        }, timeout);
    } catch(err) {
        console.log("[TCP AUDIO] Error. connection failed! " + err);
    }
};



//var dataLength = 0;
//var data = new Buffer(0);


//data from tcp server received
//client.on('data', function(Data) {
var DataReceived = function(Data) {

    //emitter.emit('data',Data.slice(4,Data.length))
    parseTcpData(Data);
};



var parseTcpData = function(data){

    //console.log('received data length :' + data.length ); 

    recvedThisTimeLen = data.length;
    //console.log('recvedThisTimeLen='+ recvedThisTimeLen);

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
            totalPacketLen = accumulatingBuffer.readUInt32BE(0) ; 
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
        emitter.emit('data',aPacketBufExceptHeader);

        //rebuild buffer
        var newBufRebuild = new Buffer( accumulatingBuffer.length );
        newBufRebuild.fill();
        accumulatingBuffer.copy( newBufRebuild, 0, totalPacketLen + packetHeaderLen, accumulatingBuffer.length  );

        //init      
        accumulatingLen -= (totalPacketLen +4) ;
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



module.exports.emitter = emitter
module.exports.listen = listen
