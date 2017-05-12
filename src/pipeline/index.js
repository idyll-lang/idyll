const Promise = require('bluebird');

const compile = require('./compile');
const parse = require('./parse');
const css = require('./css');
const write = require('./write-artifacts');
const bundle = require('./bundle-js');
const writeJS = require('./write-js');

let outputs;

const preBundle = (opts, inputCfg, customComponentFiles, componentFiles, paths, browserifyOpts) => {
  return Promise
    .resolve(compile(opts.inputString, opts.compilerOptions))
    .then((ast) => {
      return parse(ast, inputCfg, customComponentFiles, componentFiles, paths)
    })
    .then((artifacts) => {
      // assemble and add css
      outputs = Object.assign({}, artifacts, {css: css(opts)});
      return outputs;
    })
    .then((artifacts) => {
      // write everything but the JS bundle to disk
      return write(artifacts, paths);
    })
    .then(() => {
      return outputs;
    });
}

const build = (opts, paths, browserifyOpts) => {
  return bundle(browserifyOpts)
    .then((src) => {
      // add and write JS bundle
      outputs.js = src;
      return writeJS(src, paths.JS_OUTPUT_FILE, opts.debug);
    })
    .then(() => {
      return outputs;
    });
}

module.exports = {
  preBundle,
  build
}
