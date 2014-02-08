#!/bin/bash
scp bashrc pi@coder.local:~/.bashrc
scp install_go.sh pi@coder.local:~/
ssh pi@coder.local '~/install_go.sh; '
