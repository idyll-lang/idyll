const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const createJSEntry = require('./create-js-entry');

const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');

/**
 * Returns the input package's node_modules directory.
 */
const getLocalModules = paths => {
  return path.join(paths.INPUT_DIR, 'node_modules');
};

module.exports = function(opts, paths, output) {
  process.env['NODE_ENV'] = opts.watch ? 'development' : 'production';

  const bundleString = createJSEntry({
    ast: output.ast,
    components: Object.keys(output.components).map(k => {
      return [k, output.components[k]];
    }),
    data: output.data,
    options: output.opts,
    syntaxHighlighting: output.syntaxHighlighting,
    context:
      opts.context ||
      path.join(__dirname, '..', 'client', 'context').replace(/\\/g, '\\\\')
  });

  const entryPath = path.join(paths.TMP_DIR, 'entrypoint.js');
  fs.writeFileSync(entryPath, bundleString);

  return esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    outfile: paths.JS_OUTPUT_FILE,
    loader: { '.js': 'jsx' },
    minify: opts.minify,
    logLevel: 'error',
    define: {
      process: JSON.stringify({
        env: {
          NODE_DEBUG: process.env.NODE_DEBUG,
          NODE_ENV: process.env.NODE_ENV
        }
      }),
      global: 'global',
      process: 'process',
      Buffer: 'Buffer'
    },
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    plugins: [plugin(stdLibBrowser)]
  });
};
