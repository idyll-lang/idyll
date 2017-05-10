const browserify = require('browserify');
const budo = require('budo');
const babelify = require('babelify');
const path = require('path');
const compile = require('idyll-compiler');
const fs = require('fs');
const chokidar = require('chokidar');
const changeCase = require('change-case');
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
const htmlTags = require('html-tags');

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
  const BUILD_PATH = path.resolve(options.output);

  if (!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
  }

  if (!fs.existsSync(BUILD_PATH)){
    fs.mkdirSync(BUILD_PATH);
  }

  const HTML_TEMPLATE = path.resolve(options.htmlTemplate);
  const JAVASCRIPT_OUTPUT = path.resolve(path.join(BUILD_PATH, 'index.js'));
  const HTML_OUTPUT = path.resolve(path.join(BUILD_PATH, 'index.html'));
  const AST_FILE = path.resolve(path.join(TMP_PATH, 'ast.json'));
  const COMPONENT_FILE = path.resolve(path.join(TMP_PATH, 'components.js'));
  const DATA_FILE = path.resolve(path.join(TMP_PATH, 'data.js'));
  const CUSTOM_COMPONENTS_FOLDER = path.resolve(options.componentFolder);
  const DEFAULT_COMPONENTS_FOLDER = path.resolve(options.defaultComponents);
  const DATA_FOLDER = path.resolve(options.dataFolder);

  let components = [];
  let customComponents = [];
  const readComponents = () => {
    components = fs.readdirSync(DEFAULT_COMPONENTS_FOLDER);try {
    customComponents = fs.readdirSync(CUSTOM_COMPONENTS_FOLDER);
    } catch(e) {
      console.log(e);
    }
  }

  const writeAST = (ast) => {
    fs.writeFileSync(AST_FILE, JSON.stringify(filterAST(ast)));
  };

  const writeCSS = (css) => {
    fs.writeFileSync(path.join(BUILD_PATH, 'styles.css'), css);
  };

  const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, `module.exports = ${JSON.stringify(data)}`);
  };

  const writeComponents = (components) => {
    const src = Object.keys(components)
      .map((key) => {
        return `'${key}': require('${components[key]}')`;
      })
      .join(',\n\t');
    fs.writeFileSync(COMPONENT_FILE, `module.exports = {\n\t${src}\n}\n`);
  };

  const writeHTML = (meta) => {
    // const InteractiveDocument = require('./client/component');
    // tree.meta.idyllContent = ReactDOMServer.renderToString(React.createElement(InteractiveDocument));
    const output = Mustache.render(fs.readFileSync(HTML_TEMPLATE, 'utf8'), meta);
    fs.writeFileSync(HTML_OUTPUT, output);
  };

  const interpretAST = (ast) => {
    const getNodesByName = (name, tree) => {
      const predicate = typeof name === 'string' ? (s) => s === name : name;

      const byName = (acc, val) => {
        if (typeof val === 'string') return acc;
        if (predicate(val[0])) acc.push(val);

        if (val[2] && typeof val[2] !== 'string') acc = val[2].reduce(byName, acc);

        return acc;
      }

      return tree.reduce(
        byName,
        []
      )
    }

    const getMeta = (ast) => {
      // there should only be one meta node
      const metaNodes = getNodesByName('meta', ast);

      if (!metaNodes.length) {
        return {};
      }
      // data is stored in props, hence [1]
      return metaNodes[0][1].reduce(
        (acc, prop) => {
          acc[prop[0]] = prop[1][1];
          return acc;
        },
        {}
      )
    }

    const getData = (ast) => {
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

    const getComponents = (ast) => {
      const ignoreNames = ['var', 'data', 'meta', 'derived'];
      const componentNodes = getNodesByName(s => !ignoreNames.includes(s), ast);

      return componentNodes.reduce(
        (acc, node) => {
          const name = changeCase.paramCase(node[0].split('.')[0]);

          if (!acc[name]) {
            if (inputConfig.components[name]) {
              const compPath = path.parse(path.join(inputDirectory, inputConfig.components[name]));
              acc[name] = path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/');
            } else if (customComponents.indexOf(name + '.js') > -1) {
              acc[name] = path.relative(TMP_PATH, path.join(CUSTOM_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
            } else if (components.indexOf(name + '.js') > -1) {
              acc[name] = path.relative(TMP_PATH, path.join(DEFAULT_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
            } else {
              try {
                // npm modules are required via relative paths to support working with a locally linked idyll
                const compPath = path.parse(resolve.sync(name, {basedir: inputDirectory}));
                acc[name] = path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/');
              } catch (err) {
                if (htmlTags.indexOf(node[0].toLowerCase()) === -1) {
                  throw new Error(`Component named ${node[0]} could not be found.`)
                }
              }
            }
          }

          return acc;
        },
        {}
      )
    }

    return {
      ast,
      components: getComponents(ast),
      data: getData(ast),
      meta: getMeta(ast)
    }
  };

  const browserifyOpts = {
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ brfs ]
    ],
    plugin: [
      (b) => b.require([
        {file: AST_FILE, expose: '__IDYLL_AST__'},
        {file: COMPONENT_FILE, expose: '__IDYLL_COMPONENTS__'},
        {file: DATA_FILE, expose: '__IDYLL_DATA__'}
      ])
    ]
  };

  const build = (callback) => {
    process.env['NODE_ENV'] = 'production';
    var b = browserify(path.join(__dirname, 'client', 'build.js'), browserifyOpts);
    b.bundle(function(err, buff) {
      if (err) {
        console.error('Error creating index.js bundle:');
        console.error(err);
        process.exit(1);
      }
      callback(buff.toString('utf8'));
    });
  }

  const start = () => {
    const CSS_INPUT = (options.css) ?  path.resolve(options.css) : false;
    const watchedFiles = CSS_INPUT ? [IDL_FILE, CSS_INPUT] : [IDL_FILE];
    chokidar.watch(watchedFiles).on('all', (event, path) => {
      if (path.indexOf('.css') !== -1) {
        writeCSS(css(options));
      } else {
        compileAndWriteFiles();
      }
    });
    const watchedComponentFolders = [DEFAULT_COMPONENTS_FOLDER, CUSTOM_COMPONENTS_FOLDER];
    const handleComponentAddRemove = () => {
      readComponents();
      compileAndWriteFiles();
    };
    chokidar.watch(watchedComponentFolders).on('add', handleComponentAddRemove).on('unlink', handleComponentAddRemove);

    budo(path.resolve(path.join(__dirname, 'client', 'live.js')), {
      live: true,
      open: true,
      forceDefaultIndex: true,
      css: path.join(options.output, 'styles.css'),
      middleware: compression(),
      watchGlob: '**/*.{html,css,json,js}',
      browserify: browserifyOpts
    });
    compileAndWriteFiles();
  }

  const compileAndWriteFiles = () => {
    const idlInput = fs.readFileSync(IDL_FILE, 'utf8');
    try {
      const ast = compile(idlInput, options.compilerOptions);
      const tree = interpretAST(ast);
      tree.css = css(options);

      writeAST(ast);
      writeComponents(tree.components);
      writeData(tree.data);
      writeHTML(tree.meta);
      writeCSS(tree.css);
      return tree;
    } catch(err) {
      console.error('Error writing artifacts to disk:');
      console.error(err.message);
    }
  }

  readComponents();
  if (options.build) {
    const tree = compileAndWriteFiles();
    build(function (js) {
      const jsOutput = UglifyJS.minify(js, {fromString: true});
      tree.js = jsOutput.code;
      fs.writeFileSync(JAVASCRIPT_OUTPUT, tree.js);
      if (cb) cb(tree);
    });
  } else {
    start();
  }
};

module.exports = idyll;
