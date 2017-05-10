#!/usr/bin/env sh

EXPOSIFY_CONFIG='{ "jquery": "$", "three": "THREE" }' \
  ../node_modules/.bin/browserify --debug -t exposify main.js > bundle.js
open index.html
