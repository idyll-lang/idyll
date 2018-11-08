#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({pkg}).notify();

require('yargs')
  .usage('Usage: idyll <command> [options]')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .version()
  .argv
