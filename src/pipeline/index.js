const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);
const compile = require('./compile');
const parse = require('./parse');
const css = require('./css');
const write = require('./write-artifacts');
const bundleJS = require('./bundle-js');
const writeJS = require('./write-js');

let outputs;

const preBundle = (opts, paths, inputConfig) => {
  // always store source in opts.inputString
  if (paths.IDYLL_INPUT_FILE) {
    opts.inputString = fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8');
  }

  return Promise
    .resolve(compile(opts.inputString, opts.compilerOptions))
    .then((ast) => {
      return parse(ast, paths, inputConfig)
    })
    .then((artifacts) => {
      // assemble and add css
      outputs = Object.assign({}, artifacts, {css: css(opts)});
      return outputs;
    })
    .then((artifacts) => {
      // write everything but the JS bundle to disk
      return write(artifacts, paths);
    });
}

const bundle = bundleJS;

const postBundle = (opts, paths, js) => {
  // add and write JS bundle
  outputs.js = js;

  return writeJS(js, paths.JS_OUTPUT_FILE, opts.minify).then(() => {
    return outputs;
  });
}

const build = (opts, paths, inputConfig) => {
  return preBundle(opts, paths, inputConfig)
    .then(bundle.bind(null, opts, paths))
    .then(({ doBundle }) => doBundle())
    .then(postBundle.bind(null, opts, paths))
    .then(() => {
      return outputs;
    });
}

const watch = (opts, paths, inputConfig, cb, outputs) => {
  if (!opts.watch) return outputs;

  let hasUpdated;
  const {b, doBundle} = bundleJS(opts, paths);
  const bundleAndWrite = () => {
    hasUpdated = true;
    return doBundle()
      .then(postBundle.bind(null, opts, paths))
      .then(res => {
        if (cb) cb(res);
        return res;
      });
  }

  // listen for bundle dependency changes
  b.on('update', bundleAndWrite)

  // this will trigger watchify to rebuild
  const onDependencyChange = () => {
    preBundle(opts, paths, inputConfig)
      .catch((error) => {
        bs.notify(`<h2>${error.message}</h2>`, 30000);
      });
  };

  const bs = require('browser-sync').create();
  // any time an input files changes we will recompile .idl source
  // and write ast.json, components.js, and data.js to disk
  bs.watch(paths.COMPONENTS_DIR, {ignoreInitial: true}, onDependencyChange);
  bs.watch(paths.DEFAULT_COMPONENTS_DIR, {ignoreInitial: true}, onDependencyChange);
  bs.watch(paths.IDYLL_INPUT_FILE, {ignoreInitial: true}, onDependencyChange);
  // that will cause watchify to rebuild
  // so we just watch the output bundle file
  // and reload when it is updated
  bs.watch(paths.JS_OUTPUT_FILE, bs.reload);
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
    server: paths.OUTPUT_DIR,
    ui: false
  });

  if (hasUpdated) return bundleAndWrite();
  return outputs;
}

const updateCSS = (opts, paths) => {
  outputs.css = css(opts);
  return writeFile(paths.CSS_OUTPUT_FILE, outputs.css);
}

module.exports = {
  preBundle,
  bundle,
  postBundle,
  build,
  watch,
  updateCSS
}
