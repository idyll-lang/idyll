'use strict';

var assert = require('assert');
var request = require('../');

request('GET', 'https://www.yahoo.com', {cache: 'file', followRedirects: true, gzip: true}, function (err, res) {
  if (err) throw err;
  assert(res.statusCode === 200);
  res.body.pipe(process.stdout);
});
