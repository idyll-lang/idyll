#!/usr/bin/env node
const { getLocalIdyll } = require('./util');
const p = require('path');

require('yargs')
  .usage('Usage: idyll <command> [options]')
  .commandDir('cmds')
  .demandCommand()
  .help()
  .version(function() {
    console.log('Global idyll version:', require('../package').version);
    const localIdyllPath = getLocalIdyll();
    if (localIdyllPath) {
      try {
        console.log(
          'Local idyll version:',
          require(localIdyllPath).getVersion()
        );
      } catch (e) {
        console.log(
          'Local idyll version:',
          require(p.join(localIdyllPath, 'package.json')).version
        );
      }
    }
    return process.exit();
  }).argv;
