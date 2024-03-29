const React = require('react');
const ReactDOM = require('react-dom');
const Module = require('module');
const os = require('os');

const debug = require('debug')('idyll:cli');

module.exports = (paths, opts) => {
  const transformFolders = [
    ...paths.COMPONENT_DIRS,
    ...paths.DEFAULT_COMPONENT_DIRS
  ];

  debug('Reading components from directories:', transformFolders);

  const originalLoad = Module._load;
  Module._load = function(path) {
    switch (path) {
      case 'react':
        return React;
      case 'react-dom':
        return ReactDOM;
      default:
        return originalLoad.apply(Module, arguments);
    }
  };
};
