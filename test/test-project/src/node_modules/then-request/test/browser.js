'use strict';

var assert = require('assert');
var getResponse = require('./get-mock-response.js');
var window = (global.window = {});

window.XMLHttpRequest = XMLHttpRequest;
function XMLHttpRequest() {
  assert(arguments.length === 0);
  this._headers = {};
  this._responseHeaders = '';
};
// XMLHttpRequest.prototype.onreadystatechange gets assigned by user
XMLHttpRequest.prototype.open = function (method, url, async) {
  assert(async === true, 'All requests must be async');
  this._method = method;
  this._url = url;
};
XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
  this._headers[name] = value;
};
XMLHttpRequest.prototype.send = function (body) {
  assert(typeof body === 'string' || body === null, 'body must be a string or null');
  this.readyState = 3;
  this.onreadystatechange();
  this.readyState = 4;
  var res = getResponse(this._method, this._url, this._headers, body, {isClient: true});
  this.status = res.statusCode;
  this._responseHeaders = Object.keys(res.headers).map(function (header) {
    return header + ': ' + res.headers[header];
  }).join('\r\n');
  this.responseText = res.body;
  this.onreadystatechange();
};
XMLHttpRequest.prototype.getAllResponseHeaders = function () {
  return this._responseHeaders;
}
window.location = {};
window.location.host = 'http://example.com';


/*
if (xhr.readyState === 4) {
  var headers = {};
  xhr.getAllResponseHeaders().split('\r\n').forEach(function (header) {
    var h = header.split(':');
    if (h.length > 1) {
      headers[h[0].toLowerCase()] = h.slice(1).join(':').trim();
    }
  });
  resolve(new Response(xhr.status, headers, xhr.responseText));
}
*/
