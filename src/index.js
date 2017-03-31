#! /usr/bin/env node
const browserify = require('browserify');
const budo = require('budo');
const babelify = require('babelify');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const compile = require('idyll-compiler');
const fs = require('fs');
const watch = require('node-watch');
const changeCase = require('change-case');
const envify = require('envify');
const bulkify = require('bulkify');
const brfs = require('brfs');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const compression = require('compression');

const IDL_FILE = argv._[0];
const TMP_PATH = path.resolve('./.idyll/');

if (!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
}

const AST_FILE = path.resolve(TMP_PATH + '/ast.json');
const COMPONENT_FILE = path.resolve(TMP_PATH + '/components.js');
const CUSTOM_COMPONENTS_FOLDER = path.resolve(argv.components || './components/');
const DATA_FOLDER = path.resolve(argv.datasets || './data/');
const IDYLL_PATH = path.resolve(__dirname);

const components = fs.readdirSync(path.resolve(__dirname + '/components/'));
let customComponents = [];
try {
  customComponents = fs.readdirSync(CUSTOM_COMPONENTS_FOLDER);
} catch(e) {
  console.log(e);
}

const compilerOptions = {
  spellcheck: argv.spellcheck
};

const writeTemplates = (ast) => {
  const outputComponents = [];
  const checkedComponents = [];
  const ignoreNames = ['var', 'data'];


  const handleNode = (node) => {
    if (typeof node === 'string') {
      return;
    }

    const name = changeCase.paramCase(node[0]);
    const props = node[1];
    const children = node[2] || [];
    if (ignoreNames.indexOf(name) === -1 && checkedComponents.indexOf(name) === -1) {
      if (customComponents.indexOf(name + '.js') > -1) {
        outputComponents.push(`"${name}": require('${CUSTOM_COMPONENTS_FOLDER}/${name}')`);
      } else if (components.indexOf(name + '.js') > -1) {
        outputComponents.push(`"${name}": require('${IDYLL_PATH}/components/${name}')`);
      }
      checkedComponents.push(name);
    }
    children.map(handleNode);
  }
  ast.map(handleNode);
  fs.writeFile(COMPONENT_FILE, `module.exports = {\n${outputComponents.join(',\n')}\n} `);
}


const build = () => {
  process.env['NODE_ENV'] = 'production';
  var b = browserify(path.resolve(__dirname + '/templates/entry.js'), {
    fullPaths: true,
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ envify, {
        AST_FILE,
        COMPONENT_FILE,
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
        const ast = compile(data, compilerOptions);
        writeTemplates(ast);
        fs.writeFile(AST_FILE, JSON.stringify(ast));
      } catch(err) {
        console.log(err.message);
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
          COMPONENT_FILE,
          DATA_FOLDER,
          IDYLL_PATH } ],
        [ bulkify ],
        [ brfs ]
      ]
    }
  });
}


const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
try {
  const ast = compile(idlInput, compilerOptions);
  writeTemplates(ast);
  fs.writeFileSync(AST_FILE, JSON.stringify(ast));
} catch(err) {
  console.log(err.message);
}

if (argv.build) {
  build();
} else {
  start();
}
