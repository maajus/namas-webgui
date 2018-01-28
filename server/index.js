"use strict";
const server = require("./server.js");

var options = {};
options.ip = process.argv[3];
options.port = process.argv[4];
options.https = process.argv[2];
options.folder = "../client/dist/www";

server(options);

