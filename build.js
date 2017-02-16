#! /usr/bin/env node
var browserify = require('browserify');
var babelify = require('babelify');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var compile = require('idyll-compiler');
var fs = require('fs');

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
process.env['NODE_ENV'] = 'production';

var b = browserify(path.resolve(__dirname + '/entry.js'), {
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
});

b.bundle(function(err, buff) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(buff.toString('utf8'));
  fs.unlink(AST_FILE);
});


