'use strict';
/*jshint asi: true */

var test = require('tap').test
  , run  = require('./util/run')

function jquery() { return 'jq' }

test('\nproviding jquery:$ and requiring variable (non-literal) named paths', function (t) {
  var file   = 'jquery-plus-non-literals.js';
  var map    = { 'jquery': '$' };
  var window = { $: { jquery: jquery } };

  run(map, file, window, {ignoreMissing: true}, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(main(), 'jq', 'exposes $ as jquery');

    t.end();
  });
})
