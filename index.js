#! /usr/bin/env node
var budo = require('budo');
var babelify = require('babelify');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var compile = require('idyll-compiler');
var fs = require('fs');
var watch = require('node-watch');

var babelify = require('babelify');
var envify = require('envify');
var bulkify = require('bulkify');
var brfs = require('brfs');
var reactPreset = require('babel-preset-react');
var es2015Preset = require('babel-preset-es2015');
var compression = require('compression');

const IDL_FILE = argv._[0];
const AST_FILE = './.ast.json';
const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
fs.writeFileSync(AST_FILE, JSON.stringify(compile(idlInput)));

watch(IDL_FILE, (eventType, filename) => {
  fs.readFile(IDL_FILE, 'utf8', function(err, data) {
    if (err) {
      return;
    }
    try {
      fs.writeFile(AST_FILE, JSON.stringify(compile(data)));
    } catch(err) {
      console.log('Error parsing file');
    }
  })
});

budo(path.resolve(__dirname + '/entry.js'), {
  live: true,
  open: true,
  css: argv.css,
  middleware: compression(),
  watchGlob: '**/*.{html,css,json,js}',
  browserify: {
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ envify, {
        AST_FILE: path.resolve(AST_FILE),
        COMPONENTS_FOLDER: path.resolve(argv.components || './components/'),
        DATA_FOLDER: path.resolve(argv.datasets || './data/'),
        IDYLL_PATH: path.resolve(__dirname) } ],
      [ bulkify ],
      [ brfs ]
    ]
  }
});
