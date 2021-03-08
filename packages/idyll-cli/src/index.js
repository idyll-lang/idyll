const fs = require('fs');
const { dirname, basename, extname, join } = require('path');
const EventEmitter = require('events');
const mkdirp = require('mkdirp');
const commandLineArgs = require('command-line-args');

const pathBuilder = require('./path-builder');
const configureNode = require('./node-config');
const pipeline = require('./pipeline');
const { ComponentResolver, DataResolver, CSSResolver } = require('./resolvers');

const debug = require('debug')('idyll:cli');

const optionDefinitions = [{ name: 'env', alias: 'e', type: String }];
const commandLineOptions = commandLineArgs(optionDefinitions, {
  partial: true
}); //partial needed to allow yargs commands like create

function createDirectories(paths) {
  mkdirp.sync(paths.OUTPUT_DIR);
  mkdirp.sync(paths.STATIC_OUTPUT_DIR);
  mkdirp.sync(paths.TMP_DIR);
}

const searchParentDirectories = packageDir => {
  while (true) {
    if (packageDir === join(packageDir, '..')) {
      break;
    }
    packageDir = join(packageDir, '..');
    const parentPackageFilePath = join(packageDir, 'package.json');

    const parentPackageFile = fs.existsSync(parentPackageFilePath)
      ? require(parentPackageFilePath)
      : {};

    if (parentPackageFile.idyll) {
      return parentPackageFile;
    }
  }
  return {};
};

function selectIdyllConfig(inputPackage, env) {
  var hasMultipleConfigs = false; // for error handling later
  if (inputPackage.idyll) {
    // Check for an idyll env key if array found
    if (Array.isArray(inputPackage.idyll)) {
      if (env == null) {
        return {
          idyll: inputPackage.idyll[0][1],
          hasMultipleConfigs: hasMultipleConfigs
        };
      } else {
        for (var i in inputPackage.idyll) {
          hasMultipleConfigs = true;
          if (inputPackage.idyll[i][0] === env) {
            return {
              idyll: inputPackage.idyll[i][1],
              hasMultipleConfigs: hasMultipleConfigs
            };
          }
        }
        throw Error(
          'No matching env found out of available options. Please verify your package.json file(s) have  ' +
            env
        );
      }
    } else {
      // env passed but package.json is in wrong format
      if (env != null) {
        throw Error('No env found matching ' + env);
      }
      return {
        idyll: inputPackage.idyll,
        hasMultipleConfigs: hasMultipleConfigs
      };
    }
  }
  return {
    idyll: {},
    hasMultipleConfigs: hasMultipleConfigs
  };
}

const idyll = (options = {}, cb) => {
  const opts = Object.assign(
    {},
    {
      alias: {},
      watch: false,
      open: true,
      datasets: 'data',
      minify: true,
      ssr: true,
      components: 'components',
      static: 'static',
      staticOutputDir: 'static',
      defaultComponents: dirname(require.resolve('idyll-components')),
      layout: 'centered',
      theme: 'github',
      output: 'build',
      outputCSS: 'idyll_styles.css',
      outputJS: 'idyll_index.js',
      port: process.env.PORT || 3000,
      temp: '.idyll',
      template: join(__dirname, 'client', '_index.html'),
      transform: [],
      compiler: {},
      compileLibs: false,
      env: commandLineOptions.env
    },
    options
  );

  const paths = pathBuilder(opts);
  debug('Reading from paths:', paths);

  createDirectories(paths);
  configureNode(paths);

  const inputPackage = fs.existsSync(paths.PACKAGE_FILE)
    ? require(paths.PACKAGE_FILE)
    : {};

  if (
    commandLineOptions.env !== options.env &&
    (commandLineOptions.env !== undefined && options.env !== undefined)
  ) {
    //Should one supercede the other?
    throw Error(
      "Mismatch between Idyll env provided and command line arg. Please remove the Idyll({env='...',...} or the command line argument."
    );
  }

  const env = commandLineOptions.env || options.env;
  const inputConfig = selectIdyllConfig(inputPackage, env);
  const parentInputConfig = selectIdyllConfig(
    searchParentDirectories(paths.INPUT_DIR),
    env
  );
  if (parentInputConfig.hasMultipleConfigs && !inputConfig.hasMultipleConfigs) {
    throw Error(
      'Project root has multiple config options given but the local project does not. Please add envs to the local project and use the --env parameter or remove them from the top level package.'
    );
  }
  Object.assign(opts, parentInputConfig.idyll, inputConfig.idyll, options);

  // Resolve compiler plugins:
  if (opts.compiler.postProcessors) {
    opts.compiler.postProcessors = opts.compiler.postProcessors.map(
      processor => {
        try {
          return require(require.resolve(processor, {
            paths: [paths.INPUT_DIR]
          }));
        } catch (e) {
          console.log(e);
          console.warn('\n\nCould not find post-processor plugin: ', processor);
        }
      }
    );
  }

  // Resolve context:
  if (opts.context) {
    if (opts.context.indexOf('./') > -1) {
      opts.context = join(paths.INPUT_DIR, opts.context);
    }
  }

  let bs;
  let watchers;

  const createResolvers = () => {
    return new Map([
      ['components', new ComponentResolver(opts, paths)],
      ['css', new CSSResolver(opts, paths)],
      ['data', new DataResolver(opts, paths)]
    ]);
  };

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

      pipeline
        .build(opts, paths, resolvers)
        .then(output => {
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
            watchers = [
              bs.watch(paths.IDYLL_INPUT_FILE, { ignoreInitial: true }, () =>
                inst.build()
              ),
              // that will cause watchify to rebuild so we just watch the output bundle file
              // and reload when it is updated. Watch options are to prevent multiple change
              // events since the bundle file can be somewhat large
              bs.watch(
                paths.JS_OUTPUT_FILE,
                { awaitWriteFinish: { stabilityThreshold: 499 } },
                bs.reload
              ),
              // when CSS changes we reassemble and inject it
              bs.watch(paths.CSS_INPUT_FILE, { ignoreInitial: true }, () => {
                pipeline.updateCSS(paths, resolvers.get('css')).then(() => {
                  bs.reload('styles.css');
                });
              }),
              // when any static files change we do a full rebuild.
              bs.watch(paths.STATIC_DIR, { ignoreInitial: true }, () =>
                inst.build()
              )
            ];

            // Each resolver is responsible for generating a list of directories to watch for
            // their corresponding data types.
            if (!opts.compiler.postProcessors) {
              resolvers.forEach((resolver, name) => {
                let watcher = bs.watch(
                  resolver.getDirectories(),
                  { ignoreInitial: true },
                  () => {
                    inst.build();
                  }
                );
                watchers.push(watcher);
              });
            }

            bs.init({
              cors: true,
              logLevel: 'warn',
              logPrefix: 'Idyll',
              notify: false,
              server: [paths.OUTPUT_DIR],
              ui: false,
              port: opts.port,
              open: opts.open,
              plugins: [require('bs-pretty-message')]
            });
          }
        })
        .then(() => {
          this.emit('complete');
        })
        .catch(error => {
          // pass along errors if anyone is listening
          if (this.listenerCount('error')) {
            this.emit('error', error);
          } else {
            // otherwise dump to the console
            console.error(error);
          }
          bs &&
            bs.sockets &&
            bs.sockets.emit('fullscreen:message', {
              title: 'Error compiling Idyll project',
              body: error.toString()
            });
        });
      return this;
    }

    // Returns an array of the default components
    // Each element of the array is an object with keys 'name' and 'path'
    // 'name' is the file name of the component
    // 'path' is the absolute path to the component
    getComponents() {
      var components = [];
      var defaultCompsDir = this.getPaths().DEFAULT_COMPONENT_DIRS;
      var compsDir = this.getComponentsDirectory(); // grabs the `components` folder of their current directory
      var componentDirs = [defaultCompsDir, compsDir];

      componentDirs.forEach(dirs => {
        dirs.forEach(dir => {
          try {
            fs.statSync(dir);
          } catch (error) {
            // for when directory doesn't exist
            return;
          }
          fs.readdirSync(dir + '').forEach(file => {
            var compName = file.replace(/\.jsx?/g, '');
            if (compName !== 'index') {
              // avoid conflicts with index.js file
              components.push({
                name: compName,
                path: dir + '/' + file
              });
            }
          });
        });
      });
      return components;
    }

    // Returns the directory of the `components` folder
    // of this IdyllInstance
    // Note: this isn't guaranteed to exist
    // It just adds "component" to the directory of this idyll instance
    getComponentsDirectory() {
      return this.getPaths().COMPONENT_DIRS;
    }

    // Adds the given component (directory) to the components used
    // in this IdyllInstance
    // If there is already a component for the given componentPath,
    // it will be overwritten with the one from componentPath
    // If there is no components/ directory, then it will be created
    addComponent(componentPath) {
      const componentsDirectory = this.getComponentsDirectory();
      // We grab the name of the component, and put that in the components directory
      const componentFileName = basename(componentPath);
      // ensure components directory exists
      try {
        fs.statSync(componentsDirectory[0]);
      } catch (err) {
        fs.mkdirSync(componentsDirectory[0]);
      }
      fs.copyFileSync(
        componentPath,
        componentsDirectory[0] + '/' + componentFileName
      );
    }

    // Returns an array of the current datasets used in this IdyllInstance's data directory
    getDatasets() {
      var dataFolder = this.getPaths().DATA_DIR;
      var defaultData = [];
      fs.readdirSync(dataFolder).forEach(file => {
        var fileName = file;
        var datasetPath = dataFolder + '/' + file;
        var extension = extname(file);
        defaultData.push({
          name: fileName,
          path: datasetPath,
          extension: extension
        });
      });
      return defaultData;
    }

    // Adds a dataset to the current datasets used in this IdyllInstance
    // It will be added to the `data` directory of this IdyllInstance
    addDataset(datasetPath) {
      const datasetDirectory = this.getPaths().DATA_DIR;
      const datasetName = basename(datasetPath);
      try {
        fs.statSync(datasetDirectory);
      } catch (err) {
        fs.mkdirSync(datasetDirectory);
      }
      fs.copyFileSync(datasetPath, datasetDirectory + '/' + datasetName);
    }

    stopWatching() {
      if (watchers.length) {
        watchers.forEach(w => w.close());
        watchers = null;
      }
      if (bs) bs.exit();
    }
  }

  const inst = new IdyllInstance();

  return inst;
};

idyll.getVersion = () => {
  return require('../package.json').version;
};

module.exports = idyll;
