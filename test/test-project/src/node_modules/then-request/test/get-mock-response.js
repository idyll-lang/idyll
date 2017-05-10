'use strict';

var assert = require('assert');
var Response = require('http-response-object');

module.exports = getResponse;
function getResponse(method, url, headers, body, options) {
  var isClient = options.isClient;
  if (method === 'GET' && url === 'http://example.com') {
    return new Response(200, {FoO: 'bar'}, 'body');
  }
  if (method === 'GET' && url === 'http://example.com?foo=baz') {
    return new Response(200, {FoO: 'baz'}, 'body');
  }
  if (method === 'POST' && url === 'http://example.com') {
    assert(headers['Content-Type'] === 'application/json');
    assert(JSON.parse(body.toString()).foo === 'baz');
    return new Response(200, {}, 'json body');
  }
}
