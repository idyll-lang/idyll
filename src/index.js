const {
  dirname,
  isAbsolute,
  join,
  parse,
} = require('path');
const EventEmitter = require('events');
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

  let bs;

  class IdyllInstance extends EventEmitter {
    build(src) {
      if (src) opts.inputString = src;
      if (opts.debug) console.time('Build Time');

      pipeline.build(opts, paths, inputConfig)
        .then((output) => {
          if (opts.debug) console.timeEnd('Build Time')
          this.emit('update', output);
        })
        .then(() => {
          if (!bs && opts.watch && opts.inputFile) {
            bs = require('browser-sync').create();
            // any time an input files changes we will recompile .idl source
            // and write ast.json, components.js, and data.js to disk
            bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, inst.build);
            bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, inst.build);
            bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, inst.build);
            // that will cause watchify to rebuild so we just watch the output bundle file
            // and reload when it is updated. Watch options are to prevent multiple change
            // events since the bundle file can be somewhat large
            bs.watch(paths.JS_OUTPUT_FILE, {awaitWriteFinish: {stabilityThreshold: 499}}, bs.reload);
            // when CSS changes we reassemble and inject it
            bs.watch(paths.CSS_INPUT_FILE, {ignoreInitial: true}, () => {
              pipeline.updateCSS(opts, paths).then(() => {
                bs.reload('styles.css')
              });
            });

            bs.init({
              cors: true,
              logLevel: 'warn',
              logPrefix: 'Idyll',
              notify: false,
              server: [paths.INPUT_DIR, paths.OUTPUT_DIR],
              ui: false
            });
          }
        })
        .catch(console.error.bind(console));
      return this;
    }
  }

  const inst = new IdyllInstance();

  return inst;
};

module.exports = idyll;
