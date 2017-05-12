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

      const buildAndReload = () => {
        pipeline.build(opts, inputConfig, paths).then(bs.reload);
      };

      const bs = require('browser-sync').create();
      bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, buildAndReload);
      bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, buildAndReload);
      bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, buildAndReload);
      bs.init({server: paths.OUTPUT_DIR});
    });
};

module.exports = idyll;
