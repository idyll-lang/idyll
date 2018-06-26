#! /usr/bin/env node
// Lightly modified from the Ember CLI
// (https://github.com/ember-cli/ember-cli/blob/master/bin/ember)

const p = require('path');
const { spawnSync } = require('child_process');
const { getLocalIdyll } = require('./util');

const idyll = getLocalIdyll()

var cmd
if (!idyll) {
  cmd = p.join(__dirname, './cli.js');
} else {
  var idyllBin = p.join(idyll, '..', '..', 'bin')
  cmd = p.join(idyllBin, 'cli.js');
  try {
    p.statSync(cmd)
  } catch (err) {
    cmd = p.join(idyllBin, 'idyll.js')
  }
}
spawnSync(cmd, process.argv.slice(2), {
  stdio: 'inherit'
});
