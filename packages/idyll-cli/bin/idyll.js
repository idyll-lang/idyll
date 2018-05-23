#! /usr/bin/env node
// Lightly modified from the Ember CLI
// (https://github.com/ember-cli/ember-cli/blob/master/bin/ember)

const p = require('path');
const resolve = require('resolve');
const { spawnSync } = require('child_process');

resolve('idyll', {
  basedir: process.cwd()
}, (err, idyllDir) => {
  var cmd
  if (err) {
    console.log('Using global CLI');
    cmd = p.join(__dirname, './cli.js');
  } else {
    console.log('Using local CLI');
    cmd = p.join(idyllDir, '..', '..', 'bin', 'cli.js');
  }
  spawnSync(cmd, process.argv.slice(2), {
    stdio: 'inherit'
  });
});
