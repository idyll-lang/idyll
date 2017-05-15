const {
  dirname,
  isAbsolute,
  join,
  parse,
} = require('path');
const changeCase = require('change-case');
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
      defaultComponents: join('components', 'default'),
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

  pipeline
    .build(opts, inputConfig, paths)
    .then((artifacts) => {
      if (cb) cb(artifacts);
    })
    .then(() => {
      if (!opts.watch) return;

      const preBundle = () => {
        pipeline.preBundle(opts, inputConfig, paths);
      };

      const updateCSS = () => {
        pipeline.updateCSS(opts, paths).then(() => {
          bs.reload('styles.css')
        });
      }

      const bs = require('browser-sync').create();
      // any time an input files changes we will recompile .idl source
      // and write ast.json, components.js, and data.js to disk
      bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, preBundle);
      bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, preBundle);
      bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, preBundle);
      // that will cause watchify to rebuild
      // so we just watch the output bundle file
      // and reload when it is updated
      bs.watch(paths.JS_OUTPUT_FILE, bs.reload);
      // when CSS changes we reassemble and inject it
      bs.watch(paths.CSS_INPUT_FILE, {ignoreInitial: true}, updateCSS);
      bs.init({server: paths.OUTPUT_DIR});
    });
};

module.exports = idyll;
