'use strict';
/*jshint asi: true */

var test = require('tap').test
  , applyTransform = require('apply-transform')
  , transformify = require('../')

function toUpper(s) {
  return s.toUpperCase();
}

/*test('\nsimple upper case transform fn', function (t) {
  var transform = transformify(toUpper);

  applyTransform(transform(), 'hello world', function (err, res) {
    if (err) { t.fail(err); t.end() }
    t.equal(res, 'HELLO WORLD')
    t.end();
  })
})*/

