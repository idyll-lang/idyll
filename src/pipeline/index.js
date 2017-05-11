const Promise = require('bluebird');

const compile = require('./compile');
const parse = require('./parse');
const css = require('./css');
const write = require('./write-artifacts');
const bundle = require('./bundle-js');
const writeJS = require('./write-js');

module.exports = function (options, inputDir, inputCfg, customComponentFiles, componentFiles, paths, browserifyOpts) {
  let outputs;

  return Promise.resolve(compile(options.inputString, options.compilerOptions))
    .then((ast) => {
      return parse(ast, inputDir, inputCfg, customComponentFiles, componentFiles, paths)
    })
    .then((artifacts) => {
      // assemble and add css
      outputs = Object.assign({}, artifacts, {css: css(options)});
      return outputs;
    })
    .then((artifacts) => {
      // write everything but the JS bundle to disk
      return write(artifacts, paths);
    })
    .then(() => {
      // create the JS bundle
      return bundle(browserifyOpts);
    })
    .then((src) => {
      // add and write JS bundle
      outputs.js = src;
      return writeJS(src, paths.JAVASCRIPT_OUTPUT, options.debug);
    })
    .then(() => {
      return outputs;
    });
}
