#!/bin/bash
cp /home/pi/stressd/bashrc ~/.bashrc;
cp -R /home/pi/stressd/raspbian-addons/etc/* /etc/;
mkdir -p /home/pi/goroot/src/;
which go;
if [[ "$?" -ne "0" ]]; then
    /home/pi/stressd/install_go.sh; 
fi
rm -r /home/pi/goroot/src/stressd;
cp -R /home/pi/stressd /home/pi/goroot/src/stressd;
cd /home/pi/goroot/src/stressd; 
go get; 
go build;

