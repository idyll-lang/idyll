'use strict';

var assert = require('assert');
var Response = require('../');

var res = new Response(200, {
  'Foo-Bar': 'baz-Bosh',
  'bar-foo': 'bish-Bosh'
}, 'foo bar baz', 'http://example.com');
assert(res.statusCode = 200);
assert(res.headers['foo-bar'] === 'baz-Bosh');
assert(res.headers['bar-foo'] === 'bish-Bosh');
assert(res.body === 'foo bar baz');
assert(res.url === 'http://example.com');
assert(res.getBody() === 'foo bar baz');

res = new Response(404, {
  'Foo-Bar': 'baz-Bosh'
}, 'Could not find page', 'http://example.com');
assert(res.statusCode = 404);
assert(res.headers['foo-bar'] === 'baz-Bosh');
assert(res.body === 'Could not find page');
assert(res.url === 'http://example.com');
var errored = false;
try {
  res.getBody();
} catch (ex) {
  assert(ex.statusCode === 404);
  assert(ex.headers['foo-bar'] === 'baz-Bosh');
  assert(ex.body === 'Could not find page');
  assert(ex.url === 'http://example.com');
  errored = true;
}
if (!errored) {
  throw new Error('res.getBody() should throw an error when the status code is 404');
}
console.log('tests passed');
