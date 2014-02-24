#!/bin/bash

CWD=`pwd`;
cd coder;
zip -r stressd.zip app static views
mv stressd.zip "$PWD/"
cd "$CWD"
