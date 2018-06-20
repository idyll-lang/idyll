#! /usr/bin/env node
const chalk = require('chalk');
const idyll = require('../../src/');
const debug = require('debug')('idyll:cli');

exports.command = 'build';
exports.description = 'Turn index.idl into output';

exports.builder = (yargs) => {
  return buildOptions(yargs)
    .usage('Usage: idyll build')
    .example('$0 build -i index.idl', 'Turn a .idl file or project into output');
}

exports.handler = (argv) => {
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

  debug('Building with CLI arguments:', argv);
  console.log(chalk.green(`Building Idyll project with output directory: ${argv['output']}...`));
  idyll(argv).build().on('complete', () => {
    if (!argv.watch) {
      process.exit(0);
    }
  });
}

exports.buildOptions = buildOptions
function buildOptions (yargs) {
  return yargs
    .alias({
      m: 'components',
      c: 'css',
      d: 'datasets',
      q: 'default-components',
      i: 'input-file',
      s: 'input-string',
      l: 'layout',
      n: 'no-minify',
      o: 'output',
      r: 'no-ssr',
      t: 'template',
      e: 'theme'
    })
    .describe('components', 'Directory where components are located')
    .default('components', 'components')
    .array('components')
    .describe('static', 'Directory where static assets are located')
    .default('static', 'static')
    .describe('css', 'Custom CSS file to include in output')
    .describe('datasets', 'Directory where data files are located')
    .default('datasets', 'data')
    .describe('default-components', 'Directory where default set of components are located')
    .array('default-components')
    .describe('input-file', 'File containing Idyll source')
    .default('input-file', 'index.idyll')
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
    .alias('h', 'help')
}


