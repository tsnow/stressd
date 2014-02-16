#!/bin/bash
scp -R . pi@coder.local:/home/pi/stressd
ssh pi@coder.local "/home/pi/stressd/install.sh"

