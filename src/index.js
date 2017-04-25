const browserify = require('browserify');
const budo = require('budo');
const babelify = require('babelify');
const path = require('path');
const compile = require('idyll-compiler');
const fs = require('fs');
const watch = require('node-watch');
const changeCase = require('change-case');
const envify = require('envify');
const sheetify = require('sheetify/transform');
const brfs = require('brfs');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const compression = require('compression');
const Mustache = require('mustache');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const Baby = require('babyparse');
const UglifyJS = require("uglify-js");

require('babel-core/register')({
    presets: ['react']
});

const idyll = (inputPath, opts, cb) => {
  options = Object.assign({}, {
    output: 'build/',
    htmlTemplate: '_index.html',
    componentFolder: './components/',
    defaultComponents: './components/default/',
    dataFolder: './data',
    layout: 'blog',
    theme: 'idyll',
    compilerOptions: {
      spellcheck: true
    },
    build: true
  }, opts || {});

  const IDL_FILE = inputPath;
  const TMP_PATH = path.resolve( './.idyll/');

  if (!fs.existsSync(TMP_PATH)){
      fs.mkdirSync(TMP_PATH);
  }

  const BUILD_PATH = path.resolve(options.output);
  const HTML_TEMPLATE = path.resolve(options.htmlTemplate);
  const JAVASCRIPT_OUTPUT = path.resolve(BUILD_PATH + '/index.js');
  const HTML_OUTPUT = path.resolve(BUILD_PATH + '/index.html');
  const AST_FILE = path.resolve(TMP_PATH + '/ast.json');
  const COMPONENT_FILE = path.resolve(TMP_PATH + '/components.js');
  const DATA_FILE = path.resolve(TMP_PATH + '/data.js');
  const CSS_INPUT = (options.css) ?  path.resolve(options.css) : false;
  const CSS_OUTPUT = path.resolve(BUILD_PATH + '/styles.css');
  const CUSTOM_COMPONENTS_FOLDER = path.resolve(options.componentFolder);
  const DEFAULT_COMPONENTS_FOLDER = path.resolve(options.defaultComponents);
  const DATA_FOLDER = path.resolve(options.dataFolder);
  const IDYLL_PATH = path.resolve(__dirname);

  const LAYOUT_INPUT = path.resolve(`${IDYLL_PATH}/layouts/${options.layout}.css`);
  const THEME_INPUT = path.resolve(`${IDYLL_PATH}/themes/${options.theme}.css`);

  const components = fs.readdirSync(DEFAULT_COMPONENTS_FOLDER);
  let customComponents = [];
  try {
    customComponents = fs.readdirSync(CUSTOM_COMPONENTS_FOLDER);
  } catch(e) {
    console.log(e);
  }

  let templateContext = {};
  const writeCSS = () => {
    const inputCSS = CSS_INPUT ? fs.readFileSync(CSS_INPUT) : '';
    const layoutCSS = fs.readFileSync(LAYOUT_INPUT);
    const themeCSS = fs.readFileSync(THEME_INPUT);
    fs.writeFileSync(CSS_OUTPUT, layoutCSS + '\n' + themeCSS + '\n' + inputCSS);
  };

  const handleHTML = () => {
    const templateString = fs.readFileSync(HTML_TEMPLATE, 'utf8');
    process.env['AST_FILE'] = AST_FILE;
    process.env['COMPONENT_FILE'] = COMPONENT_FILE;
    process.env['DATA_FILE'] = DATA_FILE;
    process.env['IDYLL_PATH'] = IDYLL_PATH;
    const InteractiveDocument = require('./client/component');
    // templateContext.idyllContent = ReactDOMServer.renderToString(React.createElement(InteractiveDocument));
    const output = Mustache.render(templateString, templateContext);
    fs.writeFileSync(HTML_OUTPUT, output);
  };

  const writeTemplates = (ast) => {
    const outputComponents = [];
    const outputData = {};
    const checkedComponents = [];
    const ignoreNames = ['var', 'data', 'meta', 'derived'];


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
          outputComponents.push(`"${name}": require('${DEFAULT_COMPONENTS_FOLDER}/${name}')`);
        }
        checkedComponents.push(name);
      } else if (ignoreNames.indexOf(name) > -1) {
        switch(name) {
          case 'data':
            let key, source, data;
            props.forEach((p) => {
              const name = p[0];
              const type = p[1][0];
              const value = p[1][1];
              switch(name) {
                case 'name':
                  if (type === 'value') {
                    key = value;
                  }
                  break;
                case 'source':
                  if (type === 'value') {
                    source = value;
                  }
                  break;
              };
            })
            if (source.endsWith('.csv')) {
              parsed = Baby.parseFiles(DATA_FOLDER + '/' + source, { header: true });
              data = parsed.data;
            } else {
              data = require(DATA_FOLDER + '/' + source);
            }
            outputData[key] = data;
            break;
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
    fs.writeFile(DATA_FILE, `module.exports = ${JSON.stringify(outputData)}`);
  }


  const build = (cb) => {
    process.env['NODE_ENV'] = 'production';
    handleHTML();
    var b = browserify(path.resolve(__dirname + '/client/build.js'), {
      fullPaths: true,
      transform: [
        [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
        [ envify, {
          AST_FILE,
          COMPONENT_FILE,
          DATA_FILE,
          IDYLL_PATH } ],
        [ brfs ],
        [ sheetify ]
      ]
    });
    b.bundle(function(err, buff) {
      if (err) {
        console.log(err);
        return;
      }
      const jsOutput = UglifyJS.minify(buff.toString('utf8'), {
        fromString: true
      });
      fs.writeFileSync(JAVASCRIPT_OUTPUT, jsOutput.code);
      fs.unlink(AST_FILE);
      cb && cb();
    });
  }

  const start = () => {
    watch(IDL_FILE, (eventType, filename) => {
      fs.readFile(IDL_FILE, 'utf8', function(err, data) {
        if (err) {
          return;
        }
        try {
          const ast = compile(data, options.compilerOptions);
          fs.writeFile(AST_FILE, JSON.stringify(ast));
          writeTemplates(ast);
          writeCSS();
        } catch(err) {
          console.log(err.message);
        }
      })
    });

    budo(path.resolve(__dirname + '/client/live.js'), {
      live: true,
      open: true,
      forceDefaultIndex: true,
      css: '.idyll/styles.css',
      middleware: compression(),
      watchGlob: '**/*.{html,css,json,js}',
      browserify: {
        transform: [
          [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
          [ envify, {
            AST_FILE,
            COMPONENT_FILE,
            DATA_FILE,
            IDYLL_PATH } ],
          [ brfs ],
          [ sheetify ]
        ]
      }
    });
  }

  const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
  try {
    const ast = compile(idlInput, options.compilerOptions);
    fs.writeFileSync(AST_FILE, JSON.stringify(ast));
    writeTemplates(ast);
    writeCSS();
  } catch(err) {
    console.log(err.message);
  }

  if (options.build) {
    build(cb);
  } else {
    start();
  }
};

module.exports = idyll;