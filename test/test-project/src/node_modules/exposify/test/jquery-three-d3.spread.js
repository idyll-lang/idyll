'use strict';
/*jshint asi: true */

var test = require('tap').test
  , run  = require('./util/run')
  , show  = require('./util/show')

function jquery() { return 'jq' }
var three = { version: 'v1.1.1' };
var d3 = { version: 'v2.1.3' };

test('\nproviding jquery:$ three:THREE d3:d3 and exposifying src with one jquery, multiple d3 and one three require', function (t) {
  var file   = 'jquery-three-d3.spread.js';
  var map    = { jquery: '$', three: 'THREE', d3: 'd3' };
  var window = { $: { jquery: jquery }, THREE: three, d3: d3 };

  run(map, file, window, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    var res = main()
    t.equal(res.jquery, 'jq', 'exposes $ as jquery');
    t.equal(res.three, three.version, 'exposes THREE as three whose require was very nested') 
    t.equal(res.d3, d3.version, 'exposes d3')
    t.equal(res.r2d3, d3.version, 'exposes d3 which was required inline')

    t.end();
  });
})
