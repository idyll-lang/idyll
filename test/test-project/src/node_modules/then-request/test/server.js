'use strict';

var assert = require('assert');
var PassThrough = require('stream').PassThrough;
var getResponse = require('./get-mock-response.js');

require('../index.js')._request = function (method, url, options, callback) {
  assert(typeof callback === 'function');
  var duplex = !(method === 'GET' || method === 'DELETE' || method === 'HEAD');
  if (duplex) {
    return {
      end: function (body) {
        gotResponse(getResponse(method, url, options.headers, body, {isClient: false}));
      }
    };
  } else {
    gotResponse(getResponse(method, url, options.headers, null, {isClient: false}));
  }
  function gotResponse(res) {
    var stream = new PassThrough();
    stream.end(res.body);
    res.body = stream;
    callback(null, res);
  }
};
