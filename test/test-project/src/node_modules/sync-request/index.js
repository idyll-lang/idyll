'use strict';

var fs = require('fs');
var spawnSync = require('child_process').spawnSync || require('spawn-sync');
var HttpResponse = require('http-response-object');
require('concat-stream');
require('then-request');
var JSON = require('./lib/json-buffer');

Function('', fs.readFileSync(require.resolve('./lib/worker.js'), 'utf8'));

module.exports = doRequest;
function doRequest(method, url, options) {
  var req = JSON.stringify({
    method: method,
    url: url,
    options: options
  });
  var res = spawnSync(process.execPath, [require.resolve('./lib/worker.js')], {input: req});
  if (res.status !== 0) {
    throw new Error(res.stderr.toString());
  }
  if (res.error) {
    if (typeof res.error === 'string') res.error = new Error(res.error);
    throw res.error;
  }
  var response = JSON.parse(res.stdout);
  if (response.success) {
    return new HttpResponse(response.response.statusCode, response.response.headers, response.response.body, response.response.url);
  } else {
    throw new Error(response.error.message || response.error || response);
  }
}
