const fs = require('fs');
const {
  dirname,
  isAbsolute,
  join,
  parse
} = require('path');
const EventEmitter = require('events');
const changeCase = require('change-case');
const mkdirp = require('mkdirp')

const pathBuilder = require('./path-builder');
const configureNode = require('./node-config');
const pipeline = require('./pipeline');
const {
  ComponentResolver,
  DataResolver,
  CSSResolver
} = require('./resolvers')

const debug = require('debug')('idyll:cli')

function createDirectories(paths) {
  mkdirp.sync(paths.OUTPUT_DIR);
  mkdirp.sync(paths.TMP_DIR);
}

const idyll = (options = {}, cb) => {
  const opts = Object.assign({}, {
      watch: false,
      datasets: 'data',
      minify: true,
      ssr: true,
      components: 'components',
      defaultComponents: dirname(require.resolve('idyll-components')),
      layout: 'centered',
      theme: 'github',
      output: 'build',
      port: process.env.PORT || 3000,
      temp: '.idyll',
      template: join(
        __dirname,
        'client',
        '_index.html'
      ),
      transform: [],
      compiler: {
      },
    },
    options
  );
  if (opts.watch) opts.minify = false; // speed!

  const paths = pathBuilder(opts);
  debug('Reading from paths:', paths);

  createDirectories(paths);
  configureNode(paths);

  const inputPackage = fs.existsSync(paths.PACKAGE_FILE) ? require(paths.PACKAGE_FILE) : {};
  const inputConfig = Object.assign({
    components: {},
    transform: [],
    compiler: {}
  }, inputPackage.idyll || {});
  for (let key in inputConfig.components) {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
    delete inputConfig.components[key];
  };
  opts.inputConfig = inputConfig

  // Handle options that can be provided via options or via package.json
  opts.transform = options.transform || inputConfig.transform || opts.transform;
  opts.compiler = options.compiler || inputConfig.compiler || opts.compiler;
  opts.context = options.context || inputConfig.context || opts.context;

  // Resolve compiler plugins:
  if (opts.compiler.postProcessors) {
    opts.compiler.postProcessors = opts.compiler.postProcessors.map((processor) => {
      try {
        return require(processor, { basedir: paths.INPUT_DIR });
      } catch(e) {
        console.log(e);
        console.warn('\n\nCould not find post-processor plugin: ', processor);
      }
    })
  }

  // Resolve context:
  if (opts.context) {
    try {
        const context = opts.context;
        if (context.indexOf('./') > -1) {
          opts.context = require(join(paths.INPUT_DIR, context));
        } else {
          opts.context = require(context);
        }
    } catch(e) {
      console.log(e);
      console.warn('\n\nCould not find context plugin: ', opts.context);
    }
  }

  let bs;

  const createResolvers = () => {
    return new Map([
      ['components', new ComponentResolver(opts, paths)],
      ['css', new CSSResolver(opts, paths)],
      ['data', new DataResolver(opts, paths)]
    ]);
  }

  class IdyllInstance extends EventEmitter {

    getPaths() {
      return paths;
    }

    getOptions() {
      return opts;
    }

    build(src) {
      // Resolvers are recreated on each build, since new data dependencies might have been added.
      const resolvers = createResolvers();

      if (src) opts.inputString = src;

      debug('Starting the build');
      // Leaving the following timing statement in for backwards-compatibility.
      if (opts.debug) console.time('Build Time');

      pipeline.build(opts, paths, resolvers)
        .then((output) => {
          debug('Build completed');
          // Leaving the following timing statement in for backwards-compatibility.
          if (opts.debug) console.timeEnd('Build Time');
          this.emit('update', output);
        })
        .then(() => {
          if (!bs && opts.watch && opts.inputFile) {
            bs = require('browser-sync').create();
            // any time an input files changes we will recompile .idl source
            // and write ast.json, components.js, and data.js to disk
            bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, () => inst.build());
            // that will cause watchify to rebuild so we just watch the output bundle file
            // and reload when it is updated. Watch options are to prevent multiple change
            // events since the bundle file can be somewhat large
            bs.watch(paths.JS_OUTPUT_FILE, {awaitWriteFinish: {stabilityThreshold: 499}}, bs.reload);
            // when CSS changes we reassemble and inject it
            bs.watch(paths.CSS_INPUT_FILE, {ignoreInitial: true}, () => {
              pipeline.updateCSS(paths, resolvers.get('css')).then(() => {
                bs.reload('styles.css');
              });
            });

            // Each resolver is responsible for generating a list of directories to watch for
            // their corresponding data types.
            resolvers.forEach((resolver, name) => {
              bs.watch(resolver.getDirectories(), { ignoreInitial: true }, () => {
                inst.build();
              });
            });

            bs.init({
              cors: true,
              logLevel: 'warn',
              logPrefix: 'Idyll',
              notify: false,
              server: [paths.OUTPUT_DIR, paths.INPUT_DIR],
              ui: false,
              port: opts.port
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
