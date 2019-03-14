#!/usr/bin/env node
const { getLocalIdyll } = require('./util');

require('yargs')
  .usage('Usage: idyll <command> [options]')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .version(function() {
    console.log('Global idyll version:', require('../package').version);
    const localIdyllPath = getLocalIdyll();
    if (localIdyllPath) {
      console.log('Local idyll version:', require(localIdyllPath).getVersion());
    }
    return process.exit();
  }).argv;
