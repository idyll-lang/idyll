#! /usr/bin/env node

const idyll = require('../src/');

var argv = require('yargs')
  .usage('Usage: idyll index.idl')
  .example('$0 index.idl', 'Turn index.idl into output')
  .demandCommand(1)
  .alias({
    m: 'components',
    c: 'css',
    d: 'datasets',
    q: 'default-components',
    f: 'input-file',
    s: 'input-string',
    l: 'layout',
    n: 'no-minify',
    o: 'output',
    r: 'no-ssr',
    t: 'template',
    e: 'theme',
    w: 'watch'
  })
  .describe('components', 'Directory where components are located')
  .default('components', 'components')
  .describe('css', 'Custom CSS file to include in output')
  .describe('datasets', 'Directory where data files are located')
  .default('datasets', 'data')
  .describe('default-components', 'Directory where default set of components are located')
  .describe('input-file', 'File containing Idyll source')
  .describe('input-string', 'Idyll source as a string')
  .describe('layout', 'Name of (or path to) the layout to use')
  .default('layout', 'blog')
  .boolean('no-minify')
  .describe('no-minify', 'Skip JS minification')
  .describe('output', 'Directory where built files should be written')
  .default('output', 'build')
  .boolean('no-ssr')
  .describe('no-ssr', 'Do not pre-render HTML as part of the build')
  .describe('template', 'Path to HTML template')
  .array('transform')
  .describe('transform', 'Custom browserify transforms to apply.')
  .default('transform', [])
  .describe('theme', 'Name of (or path to) the theme to use')
  .default('theme', 'idyll')
  .boolean('watch')
  .describe('watch', 'Monitor input files and rebuild on changes')
  .default('watch', false)
  .alias('h', 'help')
  .argv;

// inputFile can be passed as non-hypenated argument
if (argv._[0]) argv.f = argv.inputFile = argv._[0];

// API checks the inverse
argv.minify = !argv['no-minify'];
argv.ssr = !argv['no-ssr'];

// delete stuff we don't need
delete argv._;
delete argv['$0'];
delete argv.n;
delete argv.noMinify;
delete argv['no-minify'];
delete argv.k;
delete argv.r;
delete argv.noSsr;
delete argv['no-ssr'];

// delete undefined keys so Object.assign won't use them
Object.keys(argv).forEach((key) => {
  if (argv[key] === undefined) delete argv[key];
})

idyll(argv).build();
