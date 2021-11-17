const path = require('path');
const fs = require('fs');
const browserifyInc = require('browserify-incremental');
const browserify = require('browserify');
const babelify = require('babelify');
const reactPreset = require('babel-preset-react');
const envPreset = require('babel-preset-env');
const stage2Preset = require('babel-preset-stage-2');
const brfs = require('brfs-node-15');
const Promise = require('bluebird');
const stream = require('stream');

const toStream = (k, o) => {
  let src;

  if (['ast', 'data', 'opts'].indexOf(k) > -1) {
    if (k === 'opts') {
      src = `
      var out = ${JSON.stringify(o)};
      out.context = ${(o.context || function() {}).toString()};
      module.exports = out;`;
    } else {
      src = `module.exports = ${JSON.stringify(o)}`;
    }
  } else if (k === 'syntaxHighlighting') {
    src = `module.exports = (function (){${o}})()`;
  } else {
    src = Object.keys(o)
      .map(key => `'${key}': require('${o[key]}')`)
      .join(',\n\t');
    src = `module.exports = {\n\t${src}\n}\n`;
  }

  const s = new stream.Readable();
  s.push(src);
  s.push(null);

  return s;
};

/**
 * Returns the input package's node_modules directory.
 */
const getLocalModules = paths => {
  return path.join(paths.INPUT_DIR, 'node_modules');
};

/**
 * Returns Idyll's node_modules directory.
 */
const getGlobalModules = paths => {
  return path.join(paths.APP_PATH, 'node_modules');
};

const getTransform = (opts, paths) => {
  const _getTransform = name => {
    return (opts[name] || []).map(d => require(d));
  };

  return [
    [
      babelify,
      {
        presets: [envPreset, stage2Preset, reactPreset],
        babelrc: false,
        // Ensure that Babel doesn't process both the local and global node_modules.
        ignore: opts.compileLibs
          ? null
          : new RegExp(`(${getLocalModules(paths)}|${getGlobalModules(paths)})`)
      }
    ]
  ]
    .concat(_getTransform('transform'))
    .concat([[brfs]]);
};

module.exports = function(opts, paths, output) {
  process.env['NODE_ENV'] = opts.watch ? 'development' : 'production';

  const b = browserify(
    Object.assign({}, browserifyInc.args, {
      entries: [path.join(__dirname, '..', 'client', 'build.js')],
      cache: {},
      packageCache: {},
      fullPaths: true,
      transform: getTransform(opts, paths),
      paths: [getLocalModules(paths), getGlobalModules(paths)],
      ignoreMissing: ['iterator.js'], // fix for vega-embed
      plugin: [
        b => {
          if (opts.minify) {
            b.require('react/umd/react.production.min.js', { expose: 'react' });
            b.require('react-dom/umd/react-dom.production.min.js', {
              expose: 'react-dom'
            });
          } else {
            b.require('react', { expose: 'react' });
            b.require('react-dom', { expose: 'react-dom' });
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
            });
          }

          if (opts.context) {
            b.require(opts.context, {
              expose: '__IDYLL_CONTEXT__'
            });
          } else {
            b.require(__dirname + '/../client/context', {
              expose: '__IDYLL_CONTEXT__'
            });
          }
        }
      ]
    })
  );

  browserifyInc(b, {
    cacheFile: path.join(
      paths.TMP_DIR,
      `browserify-cache${opts.minify ? '-min' : ''}.json`
    )
  });

  return new Promise((resolve, reject) => {
    b.bundle((err, src) => {
      if (err) {
        return reject(err);
      }
      resolve(src.toString('utf8'));
      // browserify-incremental has to be piped but we don't need the output
    }).pipe(require('dev-null')());
  });
};
