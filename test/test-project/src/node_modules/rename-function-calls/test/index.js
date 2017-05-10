'use strict';
/*jshint asi: true */

var test     = require('tap').test
  , rename   = require('../')
  , fs       = require('fs')
  , path     = require('path')
  , fixtures = path.join(__dirname, '/fixtures')

fs.readdirSync(fixtures, 'utf8')
  .map(function (x) { return path.basename(x) })
  .filter(function (x) { return !(/renamed\.js$/).test(x) })
  .forEach(runTest)


function runTest(fixture) {
  var name = fixture.slice(0, -('.js').length)
  var expectedFile =  name + '.renamed' + '.js';
  var expected = fs.readFileSync(path.join(fixtures, expectedFile), 'utf8');
  
  var src = fs.readFileSync(path.join(fixtures, fixture), 'utf8');
  var srcLines = src.split('\n');
  var metaString = srcLines.shift();

  src = srcLines.join('\n')
  var meta = JSON.parse(metaString.slice('// '.length))

  test('\n' + name.replace(/-/g, ' '), function (t) {
    var renamedSrc = rename(meta.from, meta.to, src);
    t.equal(renamedSrc, expected)
    t.end()  
  })
}
