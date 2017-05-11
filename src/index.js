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
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const pipeline = require('./pipeline');

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
      minify: true,
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
    opts.inputString = opts.inputString || fs.readFileSync(IDL_FILE, 'utf8')

    try {
      const paths = {
        AST_FILE,
        COMPONENTS_FILE,
        CSS_OUTPUT,
        DATA_FILE,
        DATA_FOLDER,
        HTML_TEMPLATE,
        HTML_OUTPUT,
        JAVASCRIPT_OUTPUT,
        TMP_PATH,
        CUSTOM_COMPONENTS_FOLDER,
        DEFAULT_COMPONENTS_FOLDER
      };
      return pipeline(opts, inputDir, inputCfg, customComponentFiles, componentFiles, paths, browserifyOpts)
    } catch(err) {
      console.error('Error writing artifacts to disk:');
      console.error(err.message);
    }
  }

  readComponents();
  if (opts.watch) {
    start();
  } else {
    compileAndWriteFiles()
      .then((artifacts) => {
        if (cb) cb(artifacts);
      });
  }
};

module.exports = idyll;
