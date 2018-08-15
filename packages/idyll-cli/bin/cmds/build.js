#! /usr/bin/env node
const chalk = require('chalk');
const idyll = require('../../src/');
const debug = require('debug')('idyll:cli');
const fs = require('fs');
const pathBuilder = require('../../src/path-builder');

exports.command = 'build';
exports.description = 'Turn index.idyll into standalone output';

exports.builder = (yargs) => {
  return buildOptions(yargs)
    .usage('Usage: idyll build')
    .example('$0 build -i index.idyll', 'Turn a .idl file or project into output');
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

  const paths = pathBuilder(argv);
  const inputPackage = fs.existsSync(paths.PACKAGE_FILE) ? require(paths.PACKAGE_FILE) : {};

  argv = Object.assign({}, argv, inputPackage.idyll);

  debug('Building with CLI arguments:', argv);
  console.log(`\n${chalk.green('Building Idyll project with output directory:')} ${chalk.hex('#6122fb')(argv['output'])}\n`);
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
      a: 'alias',
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
      e: 'theme',
      g: 'googleFonts',
      f: 'favicon'
    })
    .describe('components', 'Directory where components are located')
    .default('components', 'components')
    .array('components')
    .describe('static', 'Directory where static assets are located')
    .default('static', 'static')
    .describe('css', 'Custom CSS file to include in output')
    .default('css', 'styles.css')
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
    .array('googleFonts')
    .describe('googleFonts', 'List of google fonts to include.')
    .default('googleFonts', [])
    .describe('favicon', 'A .ico file to use as article favicon. This should be in the static folder, e.g. "static/favicon.ico"')
    .describe('theme', 'Name of (or path to) the theme to use')
    .default('theme', 'github')
    .describe('alias', 'A list of component aliases')
    .describe('outputCSS', 'Name of CSS file to generate')
    .default('outputCSS', 'idyll_styles.css')
    .describe('outputJS', 'Name of JS file to generate')
    .default('outputJS', 'idyll_index.js')
    .alias('h', 'help')
}


