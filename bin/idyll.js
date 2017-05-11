#! /usr/bin/env node

const idyll = require('../src/');

var argv = require('yargs')
  .usage('Usage: idyll index.idl')
  .example('$0 index.idl --build', 'Turn index.idl into output')
  .demandCommand(1)
  .alias({
    b: 'build',
    m: 'components',
    c: 'css',
    d: 'datasets',
    q: 'defaultComponents',
    f: 'inputFile',
    s: 'inputString',
    l: 'layout',
    o: 'output',
    k: 'spellcheck',
    t: 'template',
    e: 'theme'
  })
  .boolean('build')
  .describe('build', 'Generate output files and exit')
  .default('build', false)
  .describe('components', 'Directory where components are located')
  .default('components', 'components')
  .describe('css', 'Custom CSS file to include in output')
  .describe('datasets', 'Directory where data files are located')
  .default('datasets', 'data')
  .describe('defaultComponents', 'Directory where default set of components are located')
  .default('defaultComponents', 'components/default')
  .describe('inputFile', 'File containing Idyll source')
  .describe('inputString', 'Idyll source as a string')
  .describe('layout', 'Name of (or path to) the layout to use')
  .choices('layout', ['blog', 'centered', 'none'])
  .default('layout', 'blog')
  .describe('output', 'Directory where built files should be written')
  .default('output', 'build')
  .boolean('spellcheck')
  .default('spellcheck', true)
  .describe('spellcheck', 'Check spelling of Idyll source input')
  .describe('template', 'Path to HTML template')
  .default('template', '_index.html')
  .describe('theme', 'Name of (or path to) the theme to use')
  .choices('theme', ['idyll', 'github', 'none'])
  .default('theme', 'idyll')
  .alias('h', 'help')
  .argv;

// inputFile can be passed as non-hypenated argument
if (argv._[0]) argv.f = argv.inputFile = argv._[0];

// move spellcheck down a level
argv.compilerOptions = {
  spellcheck: argv.spellcheck
};

// delete stuff we don't need
delete argv._;
delete argv['$0'];
delete argv.k;
delete argv.spellcheck;

idyll(argv);
