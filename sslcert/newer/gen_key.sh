#!/usr/bin/env bash
filename="server"
openssl req -new -sha256 -nodes -out ${filename}.csr -newkey rsa:2048 -keyout ${filename}.key -config <( cat ${filename}_csr.txt )
openssl x509 -req -in ${filename}.csr -signkey ${filename}.key -out ${filename}.crt -days 500 -sha256 -extfile v3.ext
