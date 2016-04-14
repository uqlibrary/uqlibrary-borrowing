#!/usr/bin/env bash
npm install -g grunt-cli@v0.1.13
git clone -b ${CI_BRANCH} --single-branch https://github.com/uqlibrary/uqlibrary-elements ../uqlibrary-elements
chmod 755 ../uqlibrary-elements/bin/*.sh
../uqlibrary-elements/bin/codeship.sh
