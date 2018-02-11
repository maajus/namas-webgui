#!/bin/sh

echo "Copying binaries..."

cd client
gulp product
NODE_ENV='production' envify dist/www/js/site.js > dist/www/js/site1.js
mv dist/www/js/site1.js dist/www/js/site.js
gulp clean
gulp compress

#cp -r /home/justas/work/namas/webgui/server /run/user/1000/gvfs/smb-share:server=debian,share=data/server

#cp -r /home/justas/work/namas/webgui/client/dist/www /run/user/1000/gvfs/smb-share:server=debian,share=data/client/dist/

mkdir /var/tmp/rsync

rsync -r /home/justas/work/namas/webgui/server /run/user/1000/gvfs/smb-share:server=rpi,share=data/server --exclude node_modules --temp-dir /var/tmp/rsync

rsync -r /home/justas/work/namas/webgui/client/dist/www /run/user/1000/gvfs/smb-share:server=rpi,share=data/client/dist/ --exclude node_modules --temp-dir /var/tmp/rsync
