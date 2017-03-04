#! /usr/bin/env node
var browserify = require('browserify');
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
const AST_FILE = path.resolve('./.ast.json');
const COMPONENTS_FOLDER = path.resolve(argv.components || './components/');
const DATA_FOLDER = path.resolve(argv.datasets || './data/');
const IDYLL_PATH = path.resolve(__dirname);

const components = fs.readdirSync(path.resolve(__dirname + '/components/'));
const customComponents = [];
try {
  customComponents = fs.readdirSync(COMPONENTS_FOLDER);
} catch(e) {}

const writeTemplates = (ast) => {
  const outputComponents = [];
  const handleNode = (node) => {
    if (typeof node === 'string') {
      return;
    }
    const name = node[0].toLowerCase();
    const props = node[1];
    const children = node[2] || [];
    const ignoreNames = ['var', 'data'];
    if (ignoreNames.indexOf(name) === -1) {
      if (customComponents.indexOf(name + '.js') > -1) {
        outputComponents.push(`${name}: require('${COMPONENTS_FOLDER}/${name}')`);
      } else if (components.indexOf(name + '.js') > -1) {
        outputComponents.push(`${name}: require('${IDYLL_PATH}/components/${name}')`);
      }
    }
    children.map(handleNode);
  }
  ast.map(handleNode);
  fs.writeFile(path.resolve(__dirname + '/templates/components.js'), `module.exports = {${outputComponents.join(',')}} `);
}


const build = () => {
  process.env['NODE_ENV'] = 'production';

  var b = browserify(path.resolve(__dirname + '/templates/entry.js'), {
    fullPaths: true,
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ envify, {
        AST_FILE,
        COMPONENTS_FOLDER,
        DATA_FOLDER,
        IDYLL_PATH } ],
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
}

const start = () => {
  watch(IDL_FILE, (eventType, filename) => {
    fs.readFile(IDL_FILE, 'utf8', function(err, data) {
      if (err) {
        return;
      }
      try {
        writeTemplates(ast);
        fs.writeFile(AST_FILE, JSON.stringify(compile(data)));
      } catch(err) {
        console.log('Error parsing file');
      }
    })
  });

  budo(path.resolve(__dirname + '/templates/entry.js'), {
    live: true,
    open: true,
    css: argv.css,
    middleware: compression(),
    watchGlob: '**/*.{html,css,json,js}',
    browserify: {
      transform: [
        [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
        [ envify, {
          AST_FILE,
          COMPONENTS_FOLDER,
          DATA_FOLDER,
          IDYLL_PATH } ],
        [ bulkify ],
        [ brfs ]
      ]
    }
  });
}


const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
const ast = compile(idlInput);
writeTemplates(ast);
fs.writeFileSync(AST_FILE, JSON.stringify(ast));

if (argv.build) {
  build();
} else {
  start();
}
