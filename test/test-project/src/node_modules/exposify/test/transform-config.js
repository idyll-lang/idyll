'use strict';

var browserify     = require('browserify')
  , vm             = require('vm')
  , exposify       = require('../');

var test = require('tap').test;

function run(config, file, window, cb) {

  var ctx = { window: window };
  var fullPath = require.resolve('./fixtures/' + file);

  browserify()
    .require(fullPath)
    .transform(exposify, config)
    .bundle(function (err, res) {
      if (err) return cb(err);
      try {
        var require_ = vm.runInNewContext(res, ctx);
        cb(null, require_(fullPath));
      } catch (e) {
        cb(e);
      }
    });
}


function jquery() { return 'jq' }

test('\nproviding jquery:$ and exposifying src with one jquery require', function (t) {
  var file   = 'jquery-only.js';
  var window = { $: { jquery: jquery } };

  var config = {
    expose: { 'jquery': '$' }
  };

  run(config, file, window, function (err, main) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(main(), 'jq', 'exposes $ as jquery');

    t.end();
  });
});
