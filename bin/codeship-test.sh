#!/bin/bash

echo "Testing branch: ${CI_BRANCH}"

if [ ${CI_BRANCH} != "GH_PAGES" ]; then
    # Run local tests
    echo "Installing npm dependencies"
    npm install

    echo "Installing bower dependencies"
    bower install

    echo "Starting local WCT tests"
    npm test
fi
