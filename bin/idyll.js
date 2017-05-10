#! /usr/bin/env node
const idyll = require('../src/');
const path = require('path');
const isPath = (str) => {
  return (str.indexOf('/') > -1 || str.indexOf('\\') > -1);
};

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['spellcheck'],
  default: {
    spellcheck: true
  }
});

let options = {
  compilerOptions: {
    spellcheck: argv.spellcheck
  },
  build: argv.build ? argv.build : false
};

if (argv.hasOwnProperty('output')) {
  options.output = argv.output;
}
if (argv.hasOwnProperty('template')) {
  options.htmlTemplate = argv.template;
}
if (argv.hasOwnProperty('css')) {
  options.css = argv.css;
}
if (argv.hasOwnProperty('components')) {
  options.componentFolder = argv.components;
}
if (argv.hasOwnProperty('default-components')) {
  options.defaultComponents = argv['default-components'];
}
if (argv.hasOwnProperty('datasets')) {
  options.dataFolder = argv.datasets;
}
if (argv.hasOwnProperty('layout')) {
  options.layout = argv.layout;
  if (isPath(options.layout)) {
    options.layout = path.resolve(options.layout);
  }
}
if (argv.hasOwnProperty('theme')) {
  options.theme = argv.theme;
  if (isPath(options.theme)) {
    options.theme = path.resolve(options.theme);
  }
}

idyll(path.resolve(argv._[0]), options);
