const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');
const Promise = require('bluebird');

let b, doBundle;

module.exports = function ({ watch }, paths) {
  process.env['NODE_ENV'] = 'production';

  if (!b) {
    const config = {
      entries: [path.join(__dirname, '..', 'client', 'build.js')],
      cache: {},
      packageCache: {},
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

    if (watch) config.plugin.push(require('watchify'));

    b = browserify(config);
    const bundlePromise = Promise.promisify(b.bundle, {context: b});

    doBundle = () => {
      return bundlePromise().then(src => {
        return src.toString('utf8');
      });
    };
  }

  return {
    b,
    doBundle
  };
}
