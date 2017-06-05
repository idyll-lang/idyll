const path = require('path');
const fs = require('fs');
const browserifyInc = require('browserify-incremental');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const es2015Preset = require('babel-preset-es2015');
const brfs = require('brfs');
const Promise = require('bluebird');
const stream = require('stream');

let b;

const toStream = (str) => {
  const Readable = stream.Readable;
  const s = new Readable;
  s.push(str);
  s.push(null);

  return s;
};

const getTransform = (opts, paths) => {
  const _getTransform = (name) => {
    return (opts[name] || []).map(d => require(d));
  };

  return [[ babelify, { presets: [ reactPreset, es2015Preset ], babelrc: false } ]]
    .concat(_getTransform('transform'))
    .concat([[ brfs ]]);
};

module.exports = function (opts, paths, output) {
  process.env['NODE_ENV'] = opts.watch ? 'development' : 'production';

  if (!b) {
    const config = {
      entries: [path.join(__dirname, '..', 'client', 'build.js')],
      cache: {},
      packageCache: {},
      fullPaths: true,
      cacheFile: path.join(paths.TMP_DIR, 'browserify-cache.json'),
      transform: getTransform(opts, paths),
      plugin: [
        (b) => {
          const requires = [{
            key: 'syntaxHighlighting',
            requireName: '__IDYLL_SYNTAX_HIGHLIGHT__'
          }, {
            key: 'data',
            requireName: '__IDYLL_DATA__'
          }, {
            key: 'components',
            requireName: '__IDYLL_COMPONENTS__'
          }, {
            key: 'ast',
            requireName: '__IDYLL_AST__'
          }];
          requires.forEach((obj) => {
            b.exclude(obj.requireName);

            b.require(toStream(output[obj.key]), {
              expose: obj.requireName,
              basedir: paths.TMP_DIR
            })
          });
        }
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
