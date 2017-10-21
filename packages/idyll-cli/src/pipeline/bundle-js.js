const path = require('path');
const fs = require('fs');
const browserifyInc = require('browserify-incremental');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const envPreset = require('babel-preset-env');
const stage2Preset = require('babel-preset-stage-2');
const brfs = require('brfs');
const Promise = require('bluebird');
const stream = require('stream');

const toStream = (k, o) => {
  let src;

  if (['ast', 'data', 'opts'].indexOf(k) > -1) {
    src = `module.exports = ${JSON.stringify(o)}`;
  } else if (k === 'syntaxHighlighting') {
    src = `module.exports = (function (){${o}})()`;
  } else {
    src = Object.keys(o).map((key) => `'${key}': require('${o[key]}')`).join(',\n\t');
    src = `module.exports = {\n\t${src}\n}\n`;
  }

  const s = new stream.Readable;
  s.push(src);
  s.push(null);

  return s;
};

const getTransform = (opts) => {
  const _getTransform = (name) => {
    return (opts[name] || []).map(d => require(d));
  };

  return [[ babelify, { presets: [ envPreset, stage2Preset, reactPreset ], babelrc: false } ]]
    .concat(_getTransform('transform'))
    .concat([[ brfs ]]);
};

module.exports = function (opts, paths, output) {
  process.env['NODE_ENV'] = opts.watch ? 'development' : 'production';

  const b = browserifyInc({
    entries: [path.join(__dirname, '..', 'client', 'build.js')],
    cache: {},
    packageCache: {},
    fullPaths: true,
    cacheFile: path.join(paths.TMP_DIR, `browserify-cache${opts.minify ? '-min' : ''}.json`),
    transform: getTransform(opts),
    paths: [
      // Input package's NODE_MODULES
      path.join(paths.INPUT_DIR, 'node_modules'),
      // Idyll's NODE_MODULES
      path.resolve(paths.APP_PATH, 'node_modules')
    ],
    plugin: [
      (b) => {
        if (opts.minify) {
          b.require('react/umd/react.production.min.js', { expose: 'react' });
          b.require('react-dom/umd/react-dom.production.min.js', { expose: 'react-dom' });
        }
        const aliases = {
          ast: '__IDYLL_AST__',
          components: '__IDYLL_COMPONENTS__',
          data: '__IDYLL_DATA__',
          syntaxHighlighting: '__IDYLL_SYNTAX_HIGHLIGHT__',
          opts: '__IDYLL_OPTS__'
        };

        for (const key in aliases) {
          const data = output[key];
          b.exclude(aliases[key]);
          b.require(toStream(key, data), {
            expose: aliases[key],
            basedir: paths.TMP_DIR
          })
        }
      }
    ]
  });

  return new Promise((resolve, reject) => {
    b.bundle((err, src) => {
      if (err) return reject(err);
      resolve(src.toString('utf8'));
      // browserify-incremental has to be piped but we don't need the output
    }).pipe(require('dev-null')());
  })
}
