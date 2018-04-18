
const React = require('react');
const ReactDOM = require('react-dom');
const Module = require('module');
const os = require('os');

const debug = require('debug')('idyll:cli')

module.exports = (paths) => {
  const transformFolders = [...paths.COMPONENT_DIRS, ...paths.DEFAULT_COMPONENT_DIRS];

  debug('Reading components from directories:', transformFolders);

  const originalLoad = Module._load;
  const isWindows = os.platform().includes('win');
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
      presets: ['env', 'stage-2', 'react'],
      babelrc: false,
      only: isWindows ? undefined : new RegExp(`(${transformFolders.join('|')})`)
  });
}
