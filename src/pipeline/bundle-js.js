const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');
const Promise = require('bluebird');

module.exports = function (paths, watch) {
  process.env['NODE_ENV'] = 'production';

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

  const b = browserify(config);
  const bundlePromise = Promise.promisify(b.bundle, {context: b});

  function bundle (ids) {
    if (ids) {
      // this is a rebuild and we just have to rewrite the file
      b.bundle((err, src) => {
        if (err) return console.error('Error bundling: ' + err);
        fs.writeFile(paths.JS_OUTPUT_FILE, src.toString('utf8'));
      });
    } else {
      // this is a normal build and we just pass along the bundle
      return bundlePromise().then(src => {
        return src.toString('utf8');
      });
    }
  }

  // rebuild on file changes
  b.on('update', bundle);

  return bundle();
}
