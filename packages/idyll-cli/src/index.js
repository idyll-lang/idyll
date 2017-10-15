const fs = require('fs');
const {
  dirname,
  isAbsolute,
  join,
  parse
} = require('path');
const EventEmitter = require('events');
const changeCase = require('change-case');
const pathBuilder = require('./path-builder');
const configureNode = require('./node-config');
const pipeline = require('./pipeline');


const idyll = (options = {}, cb) => {
  const opts = Object.assign({}, {
      watch: false,
      datasets: 'data',
      minify: true,
      ssr: true,
      components: 'components',
      defaultComponents: dirname(require.resolve('idyll-components')),
      layout: 'blog',
      output: 'build',
      temp: '.idyll',
      template: join(
        __dirname,
        'client',
        '_index.html'
      ),
      theme: 'idyll',
      transform: [],
      compilerOptions: {
      },
    },
    options
  );
  if (opts.watch) opts.minify = false; // speed!

  const paths = pathBuilder(opts);
  configureNode(paths);

  const inputPackage = fs.existsSync(paths.PACKAGE_FILE) ? require(paths.PACKAGE_FILE) : {};
  const inputConfig = Object.assign({
    components: {},
    transform: []
  }, inputPackage.idyll || {});
  for (let key in inputConfig.components) {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
    delete inputConfig.components[key];
  };

  // Handle options that can be provided via options or via package.json
  opts.transform = options.transform || inputConfig.transform || opts.transform;

  let bs;

  class IdyllInstance extends EventEmitter {

    getPaths() {
      return paths;
    }

    getOptions() {
      return opts;
    }

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
            bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, () => inst.build());
            bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, () => inst.build());
            bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, () => inst.build());
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
              server: [paths.OUTPUT_DIR, paths.INPUT_DIR],
              ui: false
            });
          }
        })
        .catch((error) => {
          // pass along errors if anyone is listening
          if (this.listenerCount('error')) {
            this.emit('error', error);
          } else { // otherwise dump to the console
            console.error(error);
          }
        });
      return this;
    }
  }

  const inst = new IdyllInstance();

  return inst;
};

module.exports = idyll;
