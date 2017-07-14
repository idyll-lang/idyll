
const React = require('react');
const ReactDOM = require('react-dom');
var Module = require('module');

module.exports = (paths) => {
  const transformFolders = [paths.COMPONENTS_DIR, paths.DEFAULT_COMPONENTS_DIR];
  var originalLoad = Module._load;
  Module._load = function (path) {
    switch (path) {
      case 'react':
        return React;
      case 'react-dom':
        return ReactDOM;
      default:
        return originalLoad.apply(Module, arguments);
    }
  };

  require('babel-register')({
      presets: ['react', 'es2015'],
      babelrc: false,
      only: new RegExp(`(${transformFolders.join('|')})`)
  });
}
