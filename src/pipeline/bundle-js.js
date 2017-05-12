const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');
const Promise = require('bluebird');

module.exports = function (paths) {
  process.env['NODE_ENV'] = 'production';
  const b = browserify(
    path.join(__dirname, '..', 'client', 'build.js'),
    {
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
    }
  );
  return Promise.promisify(b.bundle, {context: b})().then((bundle) => {
    return bundle.toString('utf8');
  });
}
