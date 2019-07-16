#!/usr/bin/env node
const { getLocalIdyll } = require('./util');
const p = require('path');

const localIdyllPath = getLocalIdyll();
let localVersion;
let globalVersion;
if (localIdyllPath) {
  try {
    localVersion = require(localIdyllPath).getVersion();
  } catch (e) {
    localVersion = require(p.join(localIdyllPath, '..', '..', 'package.json'))
      .version;
  }
  globalVersion = require('../package').version;
}

const versionString = localIdyllPath
  ? `
  Using version ${localVersion} (installed in local directory).
  Global version is ${globalVersion}.
`
  : `
  Using version ${globalVersion} (installed globally).

  To install local dependencies in an Idyll project that
  you've cloned from GitHub, run \`npm install\`.
`;

require('yargs')
  .usage('Usage: idyll <command> [options]')
  .commandDir('cmds')
  .demandCommand()
  .version('version', 'Print the local and global versions', versionString)
  .argv;
