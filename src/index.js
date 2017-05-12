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
  if (opts.watch) opts.minify = false; // speed!

  const paths = pathBuilder(opts);

  const inputPkg = require(paths.PKG_FILE);
  const inputConfig = (inputPkg.idyll || {components: {}});
  for (let key in inputConfig.components) {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
    delete inputConfig.components[key];
  };

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

  pipeline
    .build(opts, inputConfig, paths, browserifyOpts)
    .then((artifacts) => {
      if (cb) cb(artifacts);
    })
    .then(() => {
      if (!opts.watch) return;

      const buildAndReload = () => {
        pipeline.build(opts, inputConfig, paths, browserifyOpts).then(bs.reload);
      };

      const bs = require('browser-sync').create();
      bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, buildAndReload);
      bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, buildAndReload);
      bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, buildAndReload);
      bs.init({server: paths.OUTPUT_DIR});
    });
};

module.exports = idyll;
