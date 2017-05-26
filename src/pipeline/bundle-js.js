const path = require('path');
const fs = require('fs');
const browserifyInc = require('browserify-incremental');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');
const Promise = require('bluebird');

let b;

const getTransform = (inputConfig) => {
  const _getTransform = (name) => {
    return (inputConfig[name] || []).map(d => require(d));
  };

  return _getTransform('pretransform').concat([
    [ babelify, { presets: [ reactPreset, es2015Preset ] } ],
    [ brfs ]
  ]).concat(_getTransform('transform')).concat(_getTransform('posttransform'));
}

module.exports = function (opts, paths, inputConfig) {
  process.env['NODE_ENV'] = opts.watch ? 'development' : 'production';

  if (!b) {
    const config = {
      entries: [path.join(__dirname, '..', 'client', 'build.js')],
      cache: {},
      packageCache: {},
      fullPaths: true,
      cacheFile: path.join(paths.TMP_DIR, 'browserify-cache.json'),
      transform: getTransform(inputConfig),
      plugin: [
        (b) => b.require([
          {file: paths.AST_OUTPUT_FILE, expose: '__IDYLL_AST__'},
          {file: paths.COMPONENTS_OUTPUT_FILE, expose: '__IDYLL_COMPONENTS__'},
          {file: paths.DATA_OUTPUT_FILE, expose: '__IDYLL_DATA__'}
        ])
      ]
    };

    b = browserifyInc(config);
  }

  return new Promise((resolve, reject) => {
    b.bundle((err, src) => {
      if (err) return reject(err);

      resolve(src.toString('utf8'));
    }).pipe(fs.createWriteStream(path.join(paths.TMP_DIR, 'bundle.js')));
  })
}
