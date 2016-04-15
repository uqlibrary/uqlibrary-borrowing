#!/bin/bash

echo "Testing branch: ${CI_BRANCH}"

if [ ${CI_BRANCH} != "GH_PAGES" ]; then
    # Run local tests
    echo "Installing global"
    npm install -g bower web-component-tester

    echo "Installing bower dependencies"
    bower install

    echo "Starting local WCT tests"
    wct
fi
