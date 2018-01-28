'use strict';

module.exports = function(options) {

    const koa     = require('koa');
    const serve   = require('koa-static',{defer:true});
    //const auth = require('koa-basic-auth');
    const app = new koa();
    const mount = require('koa-mount');
    const tcp = require("./tcp.js");
    const http = require('http');

    var indigma_ip = '127.0.0.1';
    var port = 443;
    var port80 = 80;
    if(options.port != undefined){
        port = options.port;
        port80 = 8080;
    }
    if(options.ip != undefined)
        indigma_ip = options.ip;


    //serve static files
    // serve files in public folder (css, js etc)
    app.use(serve(options.folder));
    //app.use(serve("/mnt/mmcblk0p1/"))
    app.use(mount('/private', serve("/mnt/mmcblk0p1/")));
/*    app.use(async(ctx, next) => {*/
        //ctx.req.socket.setNoDelay(true);
        //await next();
    /*});*/
    tcp.listen(65111,indigma_ip)
    if(options.https == "https"){

        //https server
        const fs = require('fs');
        const https = require('https');
        const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
        const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
        const pem = fs.readFileSync('sslcert/server.pem', 'utf8');
        const credentials = {key: privateKey, cert: certificate, ca:pem};
        const httpsServer = https.createServer(credentials, app.callback());
        httpsServer.listen(port);


        const io = require('./Socketio')(httpsServer,indigma_ip);

        // Redirect from http port 80 to https
        http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            res.end();
        }).listen(port80);

    }
    else{
        const server = http.createServer(app.callback()).listen(port80);
        const io = require('./Socketio')(server,indigma_ip);
    }
};
