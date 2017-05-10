'use strict';

var assert = require('assert');
var test = require('testit');
var Promise = require('promise');

test('./lib/handle-qs.js', function () {
  var handleQs = require('../lib/handle-qs.js');

  assert(handleQs('http://example.com/', {}) === 'http://example.com/');
  assert(handleQs('http://example.com/?foo=bar', {}) === 'http://example.com/?foo=bar');
  assert(handleQs('http://example.com/', {foo: 'bar'}) === 'http://example.com/?foo=bar');
  assert(handleQs('http://example.com/', {foo: {bar: 'baz'}}) === 'http://example.com/?foo%5Bbar%5D=baz');
  assert(handleQs('http://example.com/', {foo: 'bar', bing: 'bong'}) === 'http://example.com/?foo=bar&bing=bong');
  assert(handleQs('http://example.com/?foo=bar', {bing: 'bong'}) === 'http://example.com/?foo=bar&bing=bong');
  assert(handleQs('http://example.com/?foo=bar#ding', {bing: 'bong'}) === 'http://example.com/?foo=bar&bing=bong#ding');
});


require('./browser.js');
require('./server.js');

function testEnv(env) {
  var request = require(env === 'browser' ? '../browser.js' : '../index.js');
  test(env + ' - GET', function () {
    return request('GET', 'http://example.com').then(function (res) {
      assert(res.statusCode === 200);
      assert(res.headers['foo'] === 'bar');
      assert(res.body.toString() === 'body');
    });
  });
  test(env + ' - GET query', function () {
    return request('GET', 'http://example.com', {qs: {foo: 'baz'}}).then(function (res) {
      assert(res.statusCode === 200);
      assert(res.headers['foo'] === 'baz');
      assert(res.body.toString() === 'body');
    });
  });
  test(env + ' - GET -> .getBody("utf8")', function () {
    return request('GET', 'http://example.com').getBody('utf8').then(function (body) {
      assert(body === 'body');
    });
  });
  test(env + ' - POST json', function () {
    return request('POST', 'http://example.com', {json: {foo: 'baz'}}).then(function (res) {
      assert(res.statusCode === 200);
      assert(res.body.toString() === 'json body');
    });
  });


  test(env + ' - invalid method', function () {
    return request({}, 'http://example.com').then(function (res) {
      throw new Error('Expected an error');
    }, function (err) {
      assert(err instanceof TypeError);
    });
  });
  test(env + ' - invalid url', function () {
    return request('GET', {}).then(function (res) {
      throw new Error('Expected an error');
    }, function (err) {
      assert(err instanceof TypeError);
    });
  });
  test(env + ' - invalid options', function () {
    return request('GET', 'http://example.com', 'options').then(function (res) {
      throw new Error('Expected an error');
    }, function (err) {
      assert(err instanceof TypeError);
    });
  });
  test(env + ' - Callbacks', function () {
    return new Promise(function (resolve, reject) {
      return request('GET', 'http://example.com', function (err, res) {
        if (err) return reject(err);
        assert(res.statusCode === 200);
        assert(res.headers['foo'] === 'bar');
        assert(res.body.toString() === 'body');
        resolve(null);
      });
    });
  });
  test(env + ' - Callbacks', function () {
    return new Promise(function (resolve, reject) {
      return request('GET', 'http://example.com', {}, function (err, res) {
        if (err) return reject(err);
        assert(res.statusCode === 200);
        assert(res.headers['foo'] === 'bar');
        assert(res.body.toString() === 'body');
        resolve(null);
      });
    });
  });
}
testEnv('browser');
testEnv('server');
