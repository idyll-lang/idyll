const browserify = require('browserify');
const budo = require('budo');
const babelify = require('babelify');
const path = require('path');
const {
  dirname,
  isAbsolute,
  join,
  parse,
} = path;
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

const getPathFactory = (basedir) => (p) => {
  if (!p) return undefined;
  if (isAbsolute(p)) return p;
  return join(basedir, p);
}

const idyll = (options = {}, cb) => {
  const inputDir = options.inputFile
    ? isAbsolute(options.inputFile)
      ? dirname(options.inputFile)
      : dirname(join(process.cwd(), options.inputFile))
    : process.cwd();
  const getPath = getPathFactory(inputDir);
  const inputPkg = require(getPath('package.json'));
  const inputConfig = (inputPkg.idyll || {components: {}});
  for (let key in inputConfig.components) {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
    delete inputConfig.components[key];
  };

  const opts = Object.assign(
    {},
    {
      watch: false,
      components: 'components',
      datasets: 'data',
      debug: false,
      defaultComponents: path.join('components', 'default'),
      layout: 'blog',
      output: 'build',
      template: '_index.html',
      theme: 'idyll',
      compilerOptions: {
        spellcheck: true
      },
    },
    options
  );

  // input paths
  const IDL_FILE = getPath(opts.inputFile);
  const HTML_TEMPLATE = getPath(opts.template);
  const CSS_INPUT = getPath(opts.css);
  const CUSTOM_COMPONENTS_FOLDER = getPath(opts.components);
  const DEFAULT_COMPONENTS_FOLDER = getPath(opts.defaultComponents);
  const DATA_FOLDER = getPath(opts.datasets);

  // output paths
  const BUILD_PATH = getPath(opts.output);
  if (!fs.existsSync(BUILD_PATH)) fs.mkdirSync(BUILD_PATH);
  const HTML_OUTPUT = join(BUILD_PATH, 'index.html');
  const CSS_OUTPUT = join(BUILD_PATH, 'styles.css');
  const JAVASCRIPT_OUTPUT = join(BUILD_PATH, 'index.js');

  const TMP_PATH = getPath('.idyll');
  if (!fs.existsSync(TMP_PATH)) fs.mkdirSync(TMP_PATH);
  const AST_FILE = join(TMP_PATH, 'ast.json');
  const COMPONENTS_FILE = join(TMP_PATH, 'components.js');
  const DATA_FILE = join(TMP_PATH, 'data.js');

  let componentFiles = [];
  let customComponentFiles = [];
  const readComponents = () => {
    componentFiles = fs.readdirSync(DEFAULT_COMPONENTS_FOLDER);
    customComponentFiles = CUSTOM_COMPONENTS_FOLDER
      ? fs.readdirSync(CUSTOM_COMPONENTS_FOLDER)
      : [];
  }

  const writeAST = (ast) => {
    fs.writeFileSync(AST_FILE, JSON.stringify(filterAST(ast)));
  };

  const writeCSS = (css) => {
    fs.writeFileSync(CSS_OUTPUT, css);
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
    fs.writeFileSync(COMPONENTS_FILE, `module.exports = {\n\t${src}\n}\n`);
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
              const compPath = path.parse(path.join(inputDir, inputConfig.components[name]));
              acc[name] = path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/');
            } else if (customComponentFiles.indexOf(name + '.js') > -1) {
              acc[name] = path.relative(TMP_PATH, path.join(CUSTOM_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
            } else if (componentFiles.indexOf(name + '.js') > -1) {
              acc[name] = path.relative(TMP_PATH, path.join(DEFAULT_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
            } else {
              try {
                // npm modules are required via relative paths to support working with a locally linked idyll
                const compPath = path.parse(resolve.sync(name, {basedir: inputDir}));
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
        {file: COMPONENTS_FILE, expose: '__IDYLL_COMPONENTS__'},
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
    let watchedFiles = [];
    if (CSS_INPUT) watchedFiles.push(CSS_INPUT);
    if (IDL_FILE) watchedFiles.push(IDL_FILE);

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
      css: path.parse(CSS_OUTPUT).base,
      middleware: compression(),
      watchGlob: '**/*.{html,css,json,js}',
      browserify: browserifyOpts
    });
    compileAndWriteFiles();
  }

  const compileAndWriteFiles = () => {
    const idlInput = IDL_FILE
      ? fs.readFileSync(IDL_FILE, 'utf8')
      : opts.inputString;

    try {
      const ast = compile(idlInput, opts.compilerOptions);
      const tree = interpretAST(ast);
      tree.css = css(opts);

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
  if (opts.watch) {
    start();
  } else {
    const tree = compileAndWriteFiles();
    build(function (js) {
      tree.js = opts.debug ? js : UglifyJS.minify(js, {fromString: true}).code;
      fs.writeFileSync(JAVASCRIPT_OUTPUT, tree.js);
      if (cb) cb(tree);
    });
  }
};

module.exports = idyll;
