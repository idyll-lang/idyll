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
const sheetify = require('sheetify/transform');
const bulkify = require('bulkify');
const brfs = require('brfs');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const compression = require('compression');
const Mustache = require('mustache');

const IDL_FILE = argv._[0];
const TMP_PATH = path.resolve('./.idyll/');

if (!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
}

const HTML_TEMPLATE = path.resolve('_index.html');
const HTML_OUTPUT = path.resolve('build/index.html');
const AST_FILE = path.resolve(TMP_PATH + '/ast.json');
const COMPONENT_FILE = path.resolve(TMP_PATH + '/components.js');
const CSS_INPUT = (argv.css) ?  path.resolve(argv.css) : false;
const CSS_OUTPUT = path.resolve(TMP_PATH + '/styles.css');
const CUSTOM_COMPONENTS_FOLDER = path.resolve(argv.components || './components/');
const DATA_FOLDER = path.resolve(argv.datasets || './data/');
const IDYLL_PATH = path.resolve(__dirname);

const LAYOUT = argv.layout || 'blog';
const THEME = argv.theme || 'idyll';
const LAYOUT_INPUT = path.resolve(`${IDYLL_PATH}/layouts/${LAYOUT}.css`);
const THEME_INPUT = path.resolve(`${IDYLL_PATH}/themes/${THEME}.css`);

const components = fs.readdirSync(path.resolve(__dirname + '/components/'));
let customComponents = [];
try {
  customComponents = fs.readdirSync(CUSTOM_COMPONENTS_FOLDER);
} catch(e) {
  console.log(e);
}

let templateContext = {};

const compilerOptions = {
  spellcheck: argv.spellcheck
};
const writeCSS = () => {
  const inputCSS = CSS_INPUT ? fs.readFileSync(CSS_INPUT) : '';
  const layoutCSS = fs.readFileSync(LAYOUT_INPUT);
  const themeCSS = fs.readFileSync(THEME_INPUT);
  fs.writeFileSync(CSS_OUTPUT, layoutCSS + '\n' + themeCSS + '\n' + inputCSS);
};

const handleHTML = () => {
  const templateString = fs.readFileSync(HTML_TEMPLATE, 'utf8');
  const output = Mustache.render(templateString, templateContext);
  fs.writeFileSync(HTML_OUTPUT, output);
};

const writeTemplates = (ast) => {
  const outputComponents = [];
  const checkedComponents = [];
  const ignoreNames = ['var', 'data', 'meta'];


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
    } else if (ignoreNames.indexOf(name) > -1) {
      switch(name) {
        case 'meta':
          templateContext = {}
          props.forEach((p) => {
            templateContext[p[0]] = p[1][1];
          })
          break;
      }
    }
    children.map(handleNode);
  }
  ast.map(handleNode);
  fs.writeFile(COMPONENT_FILE, `module.exports = {\n${outputComponents.join(',\n')}\n} `);
}


const build = () => {
  handleHTML();
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
      [ brfs ],
      [ sheetify ]
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
        writeCSS();
        fs.writeFile(AST_FILE, JSON.stringify(ast));
      } catch(err) {
        console.log(err.message);
      }
    })
  });

  budo(path.resolve(__dirname + '/templates/entry.js'), {
    live: true,
    open: true,
    css: '.idyll/styles.css',
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
        [ brfs ],
        [ sheetify ]
      ]
    }
  });
}

const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
try {
  const ast = compile(idlInput, compilerOptions);
  writeTemplates(ast);
  writeCSS();
  fs.writeFileSync(AST_FILE, JSON.stringify(ast));
} catch(err) {
  console.log(err.message);
}

if (argv.build) {
  build();
} else {
  start();
}
