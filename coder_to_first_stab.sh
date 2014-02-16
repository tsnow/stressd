#!/bin/bash
git checkout origin/coder -- static/js/index.js .gitignore
mv static/js/index.js server/scripts/application.js
git add server/scripts/application.js
git rm --cached static/js/index.js

git diff -u "$(cat coder_latest.sha)"..origin/coder -- views/index.html | patch server/html/home.html
git rev-parse origin/coder > coder_latest.sha
git add server/html/home.html coder_latest.sha