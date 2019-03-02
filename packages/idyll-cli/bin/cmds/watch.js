#! /usr/bin/env node
const { getLocalIdyll } = require('../util');

const { handler, buildOptions } = require('./build');

exports.command = 'watch';
exports.aliases = getLocalIdyll() ? ['*'] : [];
exports.description = 'Build then start the development server';

exports.builder = yargs => {
  return buildOptions(yargs)
    .example(
      '$0 watch -i index.idl',
      'Build a single .idl file and start the dev server'
    )
    .alias({
      p: 'port'
    })
    .describe('port', 'Custom port to bind the local server to.')
    .boolean('open')
    .describe(
      'open',
      'Automatically open the page in the default browser during watch mode.'
    )
    .default('open', true)
    .boolean('minify')
    .default('minify', false)
    .boolean('ssr')
    .default('ssr', true);
};

exports.handler = argv => {
  argv.watch = true;
  handler(argv);
};
