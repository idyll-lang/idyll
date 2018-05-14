#! /usr/bin/env node
const {
  handler,
  buildOptions
} = require('./build');

exports.command = 'watch'
exports.aliases = ['*']
exports.description = 'Build then start the development server'

exports.builder = (yargs) => {
  return buildOptions(yargs)
    .example('$0 watch -f index.idl', 'Build a single .idl file and start the dev server')
    .demandCommand(1)
    .alias({
      p: 'port'
    })
    .describe('port', 'Custom port to bind the local server to.')
    .boolean('open')
    .describe('open', 'Automatically open the page in the default browser during watch mode.')
    .default('open', true);
}

exports.handler = (argv) => {
  argv.w = true
  handler(argv);
}
