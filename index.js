#! /usr/bin/env node
var budo = require('budo');
var babelify = require('babelify');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

var babelify = require('babelify');
var envify = require('envify');
var bulkify = require('bulkify');
var brfs = require('brfs');
var reactPreset = require('babel-preset-react');
var es2015Preset = require('babel-preset-es2015');

budo(path.resolve(__dirname + '/entry.js'), {
  live: true,
  open: true,
  css: argv.css,
  browserify: {
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ envify, { IDL_FILE: argv._[0], COMPONENTS_FOLDER: path.resolve(argv.components || './components/'), IDYLL_PATH: path.resolve(__dirname) } ],
      [ bulkify ],
      [ brfs ]
    ]
  }
});
