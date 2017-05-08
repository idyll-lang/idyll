const browserify = require('browserify');
const budo = require('budo');
const babelify = require('babelify');
const path = require('path');
const compile = require('idyll-compiler');
const fs = require('fs');
const watch = require('node-watch');
const changeCase = require('change-case');
const envify = require('envify');
const brfs = require('brfs');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const compression = require('compression');
const resolve = require('resolve');
const Mustache = require('mustache');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const Baby = require('babyparse');
const UglifyJS = require("uglify-js");

const css = require('./assets/css');
const filterAST = require('./assets/ast');

require('babel-core/register')({
    presets: ['react']
});

const idyll = (inputPath, opts, cb) => {
  options = Object.assign({}, {
    output: 'build',
    htmlTemplate: '_index.html',
    componentFolder: 'components',
    defaultComponents: path.join('components', 'default'),
    dataFolder: 'data',
    layout: 'blog',
    theme: 'idyll',
    compilerOptions: {
      spellcheck: true
    },
    build: true
  }, opts || {});

  const inputDirectory = path.dirname(inputPath);
  // Expose an "idyll" field on package.json
  const inputPackage = require(path.join(inputDirectory, 'package.json'));
  const inputConfig = Object.assign({}, {
    components: {}
  }, inputPackage.idyll || {});
  Object.keys(inputConfig.components).forEach(key => {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
  });

  const IDL_FILE = inputPath;
  const TMP_PATH = path.resolve(path.join(inputDirectory, '.idyll'));

  if (!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
  }

  const BUILD_PATH = path.resolve(options.output);
  const HTML_TEMPLATE = path.resolve(options.htmlTemplate);
  const JAVASCRIPT_OUTPUT = path.resolve(path.join(BUILD_PATH, 'index.js'));
  const HTML_OUTPUT = path.resolve(path.join(BUILD_PATH, 'index.html'));
  const AST_FILE = path.resolve(path.join(TMP_PATH, 'ast.json'));
  const COMPONENT_FILE = path.resolve(path.join(TMP_PATH, 'components.js'));
  const DATA_FILE = path.resolve(path.join(TMP_PATH, 'data.js'));
  const CUSTOM_COMPONENTS_FOLDER = path.resolve(options.componentFolder);
  const DEFAULT_COMPONENTS_FOLDER = path.resolve(options.defaultComponents);
  const DATA_FOLDER = path.resolve(options.dataFolder);
  const IDYLL_PATH = path.resolve(__dirname);

  const components = fs.readdirSync(DEFAULT_COMPONENTS_FOLDER);
  let customComponents = [];
  try {
    customComponents = fs.readdirSync(CUSTOM_COMPONENTS_FOLDER);
  } catch(e) {
    console.log(e);
  }

  const writeCSS = () => {
    fs.writeFileSync(path.join(BUILD_PATH, 'styles.css'), css(options));
  };

  const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, `module.exports = ${JSON.stringify(data)}`);
  };

  const writeHTML = (meta) => {
    process.env['AST_FILE'] = AST_FILE;
    process.env['COMPONENT_FILE'] = COMPONENT_FILE;
    process.env['DATA_FILE'] = DATA_FILE;
    process.env['IDYLL_PATH'] = IDYLL_PATH;

    // const InteractiveDocument = require('./client/component');
    // tree.meta.idyllContent = ReactDOMServer.renderToString(React.createElement(InteractiveDocument));
    const output = Mustache.render(fs.readFileSync(HTML_TEMPLATE, 'utf8'), meta);
    fs.writeFileSync(HTML_OUTPUT, output);
  };

  const interpretAST = (ast) => {
    const ignoreNames = ['var', 'data', 'meta', 'derived'];

    const getMeta = (ast) => {
      // there should only be one meta node
      const metaNode = getNodesByName('meta', ast)[0];
      // data is stored in props, hence [1]
      return metaNode[1].reduce(
        (acc, prop) => {
          acc[prop[0]] = prop[1][1];
          return acc;
        },
        {}
      )
    }

    const getData = (acc, node) => {
      // can be multiple data nodes
      const dataNodes = getNodesByName('data', ast);

      // turn each data node into a field on an object
      // whose key is the name prop
      // and whose value is the parsed data
      return dataNodes.reduce(
        (acc, dataNode) => {
          const props = dataNode[1];
          const { name, source } = props.reduce(
            (hash, val) => {
              hash[val[0]] = val[1][1];
              return hash;
            },
            {}
          );

          if (source.endsWith('.csv')) {
            acc[name] = Baby.parseFiles(path.join(DATA_FOLDER, source), { header: true }).data;
          } else {
            acc[name] = require(path.join(DATA_FOLDER, source));
          }

          return acc;
        },
        {}
      );
    }

    return {
      meta: getMeta(ast),
      data: getData(ast)
    }
  };

  const writeAST = (ast) => {
    fs.writeFileSync(AST_FILE, JSON.stringify(filterAST(ast)));
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
        if (inputConfig.components[name]) {
          const compPath = path.parse(path.join(inputDirectory, inputConfig.components[name]));
          outputComponents.push(`'${name}': require('${path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/')}')`);
        } else if (customComponents.indexOf(name + '.js') > -1) {
          outputComponents.push(`'${name}': require('${path.relative(TMP_PATH, path.join(CUSTOM_COMPONENTS_FOLDER, name)).replace(/\\/g, '/')}')`);
        } else if (components.indexOf(name + '.js') > -1) {
          outputComponents.push(`'${name}': require('${path.relative(TMP_PATH, path.join(DEFAULT_COMPONENTS_FOLDER, name)).replace(/\\/g, '/')}')`);
        } else {
          try {
            // npm modules are required via relative paths to support working with a locally linked idyll
            const compPath = path.parse(resolve.sync(name, {basedir: inputDirectory}));
            outputComponents.push(`'${name}': require('${path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/')}')`);
          } catch (err) {
            if (node[0].toLowerCase() !== node[0]) throw new Error(`Component named ${node[0]} could not be found.`)
          }
        }
        checkedComponents.push(name);
      }
      children.map(handleNode);
    }
    ast.map(handleNode);

    fs.writeFileSync(COMPONENT_FILE, `module.exports = {\n${outputComponents.join(',\n')}\n} `);
  }


  const build = (cb) => {
    process.env['NODE_ENV'] = 'production';
    // this path stuff is pretty ugly but necessary until client files don't rely on env vars
    const clientDir = path.join(__dirname, 'client');
    const visitorsDir = path.join(clientDir, 'visitors');
    var b = browserify(path.join(clientDir, 'build.js'), {
      transform: [
        [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
        [ envify, {
          AST_FILE: path.join(path.relative(clientDir, TMP_PATH), path.parse(AST_FILE).base),
          COMPONENT_FILE: path.join(path.relative(visitorsDir, TMP_PATH), path.parse(COMPONENT_FILE).base),
          DATA_FILE: path.join(path.relative(visitorsDir, TMP_PATH), path.parse(DATA_FILE).base),
          IDYLL_PATH
        } ],
        [ brfs ]
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
      cb && cb();
    });
  }

  const start = () => {
    const watchedFiles = CSS_INPUT ? [IDL_FILE, CSS_INPUT] : [IDL_FILE];
    watch(watchedFiles, (filename) => {
      if (filename.indexOf('.css') !== -1) {
        writeCSS();
      } else {
        fs.readFile(IDL_FILE, 'utf8', function(err, data) {
          if (err) {
            return;
          }
          try {
            const ast = compile(data, options.compilerOptions);
            writeAST(ast);
            writeTemplates(ast);
          } catch(err) {
            console.log(err.message);
          }
        })
      }

    });

    budo(path.resolve(path.join(__dirname, 'client', 'live.js')), {
      live: true,
      open: true,
      forceDefaultIndex: true,
      css: path.join(options.output, 'styles.css'),
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
          [ brfs ]
        ]
      }
    });
  }

  const getNodesByName = (name, tree) => {
    const byName = (acc, val) => {
      if (typeof val === 'string') return acc;
      if (changeCase.paramCase(val[0]) === name) acc.push(val);

      if (val[2] && typeof val[2] !== 'string') acc = val[2].reduce(byName, acc);

      return acc;
    }

    return tree.reduce(
      byName,
      []
    )
  }

  const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
  try {
    const ast = compile(idlInput, options.compilerOptions);
    const tree = interpretAST(ast);

    writeAST(ast);
    writeHTML(tree.meta);
    writeData(tree.data);
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
