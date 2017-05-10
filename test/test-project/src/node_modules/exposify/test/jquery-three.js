'use strict';
/*jshint asi: true */

var test = require('tap').test
  , run  = require('./util/run')
  , show  = require('./util/show')


function jquery() { return 'jq' }
var three = { version: 'v1.1.1' };

test('\nproviding jquery:$ three:THREE and exposifying src with one jquery and three require', function (t) {
  var file   = 'jquery-three.js';
  var map    = { 'jquery': '$', 'three': 'THREE' };
  var window = { $: { jquery: jquery }, THREE: three };

  run(map, file, window, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    var res = main()
    t.equal(res.jquery, 'jq', 'exposes $ as jquery');
    t.equal(res.three, three.version, 'exposes THREE as three') 

    t.end();
  });
})

test('\nproviding jquery:$ and exposifying src with one jquery and three require', function (t) {
  var file   = 'jquery-three.js';
  var map    = { 'jquery': '$' };
  var window = { $: { jquery: jquery }, THREE: three };

  run(map, file, window, function (err, main) {
    t.similar(err, /module "three" not found from/, 'does not expose three')
    t.end();
  });
})
