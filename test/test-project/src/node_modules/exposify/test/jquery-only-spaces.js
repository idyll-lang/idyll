'use strict';
/*jshint asi: true */

var test = require('tap').test
  , run  = require('./util/run')

function jquery() { return 'jq' }

test('\nproviding jquery:$ and exposifying src with one jquery require that contains spaces', function (t) {
  var file   = 'jquery-only-spaces.js';
  var map    = { 'jquery': '$' };
  var window = { $: { jquery: jquery } };

  run(map, file, window, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(main(), 'jq', 'exposes $ as jquery');

    t.end();
  });
})
