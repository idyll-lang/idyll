/*jshint asi: true */

var test = require('tap').test
  , run  = require('./util/run')
  , show  = require('./util/show')

var lodash = { lo: 'and behold' }

test('\nproviding lodash: _.noConflict() and exposifying src with one lodash require', function (t) {
  var file   = 'lodash-noconflict.js';
  var map    = { 'lodash': '_.noConflict()' };
  var window = { _: { noConflict: function nodConflict() { return lodash } } };

  run(map, file, window, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(main(), 'and behold', 'exposes _.noConflict() as lodash');

    t.end();
  });
})
