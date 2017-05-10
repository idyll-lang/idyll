'use strict';

var browserify     = require('browserify')
  , vm             = require('vm')
  , exposify       = require('../../')

module.exports = function run(map, file, window, cb) {
  exposify.config = map;

  var ctx = { window: window };
  var fullPath = require.resolve('../fixtures/' + file);

  // If five arguments are provided, fourth one is an object for browserify
  // options.
  var opts = {};
  if (arguments.length === 5) {
    opts = cb;
    cb = arguments[4];
  }

  // If ignoreMissing is true, set ctx.require to a no-op. This needed for the
  // jquery-plus-non-literals test, as it has require statements that don't get
  // converted with browserify-shim.
  if ('ignoreMissing' in opts) {
    ctx.require = function() {};
  }

  browserify(opts)
    .require(fullPath)
    .transform(exposify)
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

