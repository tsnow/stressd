#!/bin/bash

ping -c 1 google.com
DNS_WORKS="$?"

if [[ "$DNS_WORKS" == "0" ]]; then
    echo "DNS is setup correctly.";
else 
    echo "Please set a nameserver in /etc/resolv.conf, can't find google.com";
    exit 1;
fi

mkdir /home/pi/goroot;
source /home/pi/.bashrc;

sudo apt-get install -y mercurial;
sudo apt-get install -y git;
hg clone -u tip https://code.google.com/p/go; # fetch the repo (tip)
cd go/src;
./all.bash;

