'use strict';

var fs = require('fs')
  , expose = require('../../').expose

// supports same signature as run in order to quickly troubleshoot by simply changing 'run' to 'show'
module.exports = function show(map, file, _, cb) {
  var fullPath = require.resolve('../fixtures/' + file);
  var src = fs.readFileSync(fullPath, 'utf8');

  var res = expose(map, src);
  if (cb) cb(null, res);
  console.error(res);
  return res;
}
