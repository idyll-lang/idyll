#! /usr/bin/env node
var budo = require('budo');
var babelify = require('babelify');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

budo(path.resolve(__dirname + '/entry.js'), {
  live: true,
  open: true,
  css: argv.css,
  browserify: {
    transform: [
      [ "babelify", { "presets": [ "react", "es2015" ] } ],
      [ "envify", {"IDL_FILE": argv._[0]} ],
      [ "brfs" ]
    ]
  }
});
