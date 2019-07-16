#! /usr/bin/env node
const chalk = require('chalk');
const idyll = require('../../src/');
const debug = require('debug')('idyll:cli');
const fs = require('fs');
const pathBuilder = require('../../src/path-builder');

exports.command = 'build';
exports.description = 'Turn index.idyll into standalone output';

exports.builder = yargs => {
  return buildOptions(yargs)
    .usage('Usage: idyll build')
    .example(
      '$0 build -i index.idyll',
      'Turn a .idl file or project into output'
    );
};

exports.handler = argv => {
  // delete stuff we don't need
  delete argv._;
  delete argv['$0'];

  [
    'a',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'l',
    'm',
    'n',
    'o',
    'q',
    'r',
    's',
    't'
  ].forEach(key => {
    delete argv[key];
  });

  const defaults = {
    components: ['components'],
    static: 'static',
    css: 'styles.css',
    datasets: 'data',
    inputFile: 'index.idyll',
    layout: 'blog',
    output: 'build',
    transform: [],
    googleFonts: [],
    outputJS: 'idyll_index.js',
    outputCSS: 'idyll_styles.css'
  };

  const paths = pathBuilder(Object.assign({}, defaults, argv));
  const inputPackage = fs.existsSync(paths.PACKAGE_FILE)
    ? require(paths.PACKAGE_FILE)
    : {};

  argv = Object.assign({}, inputPackage.idyll, argv);

  Object.keys(defaults).forEach(key => {
    if (argv[key] === undefined) {
      argv[key] = defaults[key];
    }
  });

  debug('Building with CLI arguments:', argv);
  console.log(
    `\n${chalk.green(
      'Building Idyll project with output directory:'
    )} ${chalk.magenta(argv['output'])}\n`
  );
  idyll(argv)
    .build()
    .on('complete', () => {
      if (!argv.watch) {
        process.exit(0);
      }
    });
};

exports.buildOptions = buildOptions;
function buildOptions(yargs) {
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
    .array('components')
    .describe('static', 'Directory where static assets are located')
    .describe('css', 'Custom CSS file to include in output')
    .describe('datasets', 'Directory where data files are located')
    .describe(
      'default-components',
      'Directory where default set of components are located'
    )
    .array('default-components')
    .describe('input-file', 'File containing Idyll source')
    .describe('input-string', 'Idyll source as a string')
    .describe('layout', 'Name of (or path to) the layout to use')
    .boolean('minify')
    .describe('minify', 'Minify JS')
    .default('minify', true)
    .describe('output', 'Directory where built files should be written')
    .boolean('ssr')
    .describe('ssr', 'Pre-render HTML as part of the build')
    .default('ssr', true)
    .describe('template', 'Path to HTML template')
    .array('transform')
    .describe('transform', 'Custom browserify transforms to apply.')
    .array('googleFonts')
    .describe('googleFonts', 'List of google fonts to include.')
    .describe(
      'favicon',
      'A .ico file to use as article favicon. This should be in the static folder, e.g. "static/favicon.ico"'
    )
    .describe('theme', 'Name of (or path to) the theme to use')
    .describe('alias', 'A list of component aliases')
    .describe('outputCSS', 'Name of CSS file to generate')
    .describe('outputJS', 'Name of JS file to generate')
    .alias('h', 'help');
}
