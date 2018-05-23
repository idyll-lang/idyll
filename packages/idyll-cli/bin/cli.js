#!/usr/bin/env node

require('yargs')
  .usage('Usage: idyll <command> [options]')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .argv
