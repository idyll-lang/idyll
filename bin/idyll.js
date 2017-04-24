#! /usr/bin/env node
var idyll = require('../src/');
const argv = require('minimist')(process.argv.slice(2));

let options = {
  compilerOptions: {
    spellcheck: argv.spellcheck ? argv.spellcheck : true
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
if (argv.hasOwnProperty('datasets')) {
  options.dataFolder = argv.datasets;
}
if (argv.hasOwnProperty('layout')) {
  options.layout = argv.layout;
}
if (argv.hasOwnProperty('theme')) {
  options.theme = argv.theme;
}


idyll(argv._[0], options);
