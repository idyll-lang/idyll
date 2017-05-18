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

  return compile(opts.inputString, opts.compilerOptions)
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
    .then(postBundle.bind(null, opts, paths))
    .then(() => {
      return outputs;
    });
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
  updateCSS
}
