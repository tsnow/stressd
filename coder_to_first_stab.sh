#!/bin/bash
git diff -u "$(cat coder_latest.sha)"..HEAD -- coder/views/index.html | patch server/html/home.html
git rev-parse HEAD > coder_latest.sha
git add server/html/home.html coder_latest.sha

