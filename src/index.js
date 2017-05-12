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

const pathBuilder = require('./path-builder');
const pipeline = require('./pipeline');

require('babel-core/register')({
    presets: ['react']
});

const idyll = (options = {}, cb) => {
  const opts = Object.assign({}, {
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

  const paths = pathBuilder(opts);

  const inputPkg = require(paths.PKG_FILE);
  const inputCfg = (inputPkg.idyll || {components: {}});
  for (let key in inputCfg.components) {
    inputCfg.components[changeCase.paramCase(key)] = inputCfg.components[key];
    delete inputCfg.components[key];
  };

  let componentFiles = [];
  let customComponentFiles = [];
  const readComponents = () => {
    componentFiles = fs.readdirSync(paths.DEFAULT_COMPONENTS_DIR);
    customComponentFiles = paths.COMPONENTS_DIR
      ? fs.readdirSync(paths.COMPONENTS_DIR)
      : [];
  }

  const browserifyOpts = {
    transform: [
      [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
      [ brfs ]
    ],
    plugin: [
      (b) => b.require([
        {file: paths.AST_OUTPUT_FILE, expose: '__IDYLL_AST__'},
        {file: paths.COMPONENTS_OUTPUT_FILE, expose: '__IDYLL_COMPONENTS__'},
        {file: paths.DATA_OUTPUT_FILE, expose: '__IDYLL_DATA__'}
      ])
    ]
  };

  const start = () => {
    let watchedFiles = [];
    if (paths.CSS_INPUT_FILE) watchedFiles.push(paths.CSS_INPUT_FILE);
    if (paths.IDYLL_INPUT_FILE) watchedFiles.push(paths.IDYLL_INPUT_FILE);

    chokidar.watch(watchedFiles).on('all', (event, path) => {
      if (path.indexOf('.css') !== -1) {
        writeCSS(css(options));
      } else {
        compileAndWriteFiles();
      }
    });
    const watchedComponentFolders = [paths.DEFAULT_COMPONENTS_DIR, paths.COMPONENTS_DIR];
    const handleComponentAddRemove = () => {
      readComponents();
      compileAndWriteFiles();
    };
    chokidar.watch(watchedComponentFolders).on('add', handleComponentAddRemove).on('unlink', handleComponentAddRemove);

    budo(path.resolve(path.join(__dirname, 'client', 'live.js')), {
      live: true,
      open: true,
      forceDefaultIndex: true,
      css: path.parse(CSS_OUTPUT_FILE).base,
      middleware: compression(),
      watchGlob: '**/*.{html,css,json,js}',
      browserify: browserifyOpts
    });
    compileAndWriteFiles();
  }

  const compileAndWriteFiles = () => {
    opts.inputString = opts.inputString || fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8')

    try {
      return pipeline.preBundle(
        opts,
        inputCfg,
        customComponentFiles,
        componentFiles,
        paths,
        browserifyOpts
      );
    } catch(err) {
      console.error('Error writing artifacts to disk:');
      console.error(err.message);
    }
  }

  readComponents();
  const pre = compileAndWriteFiles()
  if (opts.watch) {
    start();
  } else {
    pre
      .then((outputs) => {
        return pipeline.build(options, paths, browserifyOpts);
      })
      .then((artifacts) => {
        if (cb) cb(artifacts);
      });
  }
};

module.exports = idyll;
