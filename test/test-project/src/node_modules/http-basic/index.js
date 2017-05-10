'use strict';

var parseUrl = require('url').parse;
var resolveUrl = require('url').resolve;
var zlib = require('zlib');
var protocols  = {http: require('http'), https: require('https')};
var PassThrough = require('stream').PassThrough;
var Response = require('http-response-object');
var caseless = require('caseless');
var cacheUtils = require('./lib/cache-utils.js');
var builtinCaches = {
  memory: new (require('./lib/memory-cache.js'))(),
  file: new (require('./lib/file-cache.js'))(__dirname + '/cache')
};

module.exports = request;
function request(method, url, options, callback) {
  var start = Date.now();
  if (typeof method !== 'string') {
    throw new TypeError('The method must be a string.');
  }
  if (typeof url !== 'string') {
    throw new TypeError('The URL/path must be a string.');
  }
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  if (options === null || options === undefined) {
    options = {};
  }
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object (or null)');
  }

  method = method.toUpperCase();
  var urlString = url;
  url = parseUrl(urlString);

  if (!url.protocol || !protocols[url.protocol.replace(/\:$/, '')]) {
    throw new TypeError('The protocol "' + url.protocol + '" is not supported, cannot load "' + urlString + '"');
  }

  var rawHeaders = options.headers || {};
  var headers = caseless(rawHeaders);
  if (url.auth) {
    headers.set('Authorization', 'Basic ' + (new Buffer(url.auth)).toString('base64'));
  }
  var agent = 'agent' in options ? options.agent : false;

  var cache = options.cache;
  if (typeof cache === 'string' && cache in builtinCaches) {
    cache = builtinCaches[cache];
  }
  if (cache && !(typeof cache === 'object' && typeof cache.getResponse === 'function' && typeof cache.setResponse === 'function')) {
    throw new TypeError(cache + ' is not a valid cache, caches must have `getResponse` and `setResponse` methods.');
  }

  var duplex = !(method === 'GET' || method === 'DELETE' || method === 'HEAD');

  if (options.gzip) {
    headers.set('Accept-Encoding', headers.has('Accept-Encoding') ? headers.get('Accept-Encoding') + ',gzip,deflate' : 'gzip,deflate');
    return request(method, urlString, {
      allowRedirectHeaders: options.allowRedirectHeaders,
      headers: rawHeaders,
      agent: agent,
      followRedirects: options.followRedirects,
      retry: options.retry,
      retryDelay: options.retryDelay,
      maxRetries: options.maxRetries,
      cache: cache,
      timeout: options.timeout
    }, function (err, res) {
      if (err) return callback(err);
      switch (res.headers['content-encoding']) {
        case 'gzip':
          delete res.headers['content-encoding'];
          res.body = res.body.pipe(zlib.createGunzip());
          break;
        case 'deflate':
          delete res.headers['content-encoding'];
          res.body = res.body.pipe(zlib.createInflate());
          break;
      }
      return callback(err, res);
    });
  }
  if (options.followRedirects) {
    return request(method, urlString, {
      allowRedirectHeaders: options.allowRedirectHeaders,
      headers: rawHeaders,
      agent: agent,
      retry: options.retry,
      retryDelay: options.retryDelay,
      maxRetries: options.maxRetries,
      cache: cache,
      timeout: options.timeout
    }, function (err, res) {
      if (err) return callback(err);
      if (options.followRedirects && isRedirect(res.statusCode)) {
        // prevent leakage of file handles
        res.body.resume();
        if (method === 'DELETE' && res.statusCode === 303) {
          // 303 See Other should convert to GET for duplex
          // requests and for DELETE
          method = 'GET';
        }
        if (options.maxRedirects === 0) {
          var err = new Error('Maximum number of redirects exceeded');
          err.res = res;
          return callback(err, res);
        }
        var opts = {};
        Object.keys(options).forEach(function (key) {
          opts[key] = options[key];
        });
        options = opts;
        if (options.maxRedirects && options.maxRedirects !== Infinity) {
          options.maxRedirects--;
        }
        // don't maintain headers through redirects
        // This fixes a problem where a POST to http://example.com
        // might result in a GET to http://example.co.uk that includes "content-length"
        // as a header
        var headers = caseless(options.headers), redirectHeaders = {};
        if (options.allowRedirectHeaders) {
          var headerName, headerValue;
          for (var i = 0; i < options.allowRedirectHeaders.length; i++) {
            headerName = options.allowRedirectHeaders[i];
            headerValue = headers.get(headerName);
            if (headerValue) {
              redirectHeaders[headerName] = headerValue;
            }
          }
        }
        options.headers = redirectHeaders;
        return request(duplex ? 'GET' : method, resolveUrl(urlString, res.headers.location), options, callback);
      } else {
        return callback(null, res);
      }
    });
  }
  if (cache && method === 'GET') {
    var timestamp = Date.now();
    return cache.getResponse(urlString, function (err, cachedResponse) {
      if (err) {
        console.warn('Error reading from cache: ' + err.message);
      }
      if (cachedResponse && (cache.isMatch ? cache : cacheUtils).isMatch(rawHeaders, cachedResponse)) {
        if (!(cache.isExpired ? cache : cacheUtils).isExpired(cachedResponse)) {
          var res = new Response(cachedResponse.statusCode, cachedResponse.headers, cachedResponse.body);
          res.url = urlString;
          res.fromCache = true;
          res.fromNotModified = false;
          return callback(null, res);
        } else if (cachedResponse.headers['etag']) {
          headers.set('If-None-Match', cachedResponse.headers['etag']);
        }
      }
      request('GET', urlString, {
        allowRedirectHeaders: options.allowRedirectHeaders,
        headers: rawHeaders,
        retry: options.retry,
        retryDelay: options.retryDelay,
        maxRetries: options.maxRetries,
        agent: agent,
        timeout: options.timeout
      }, function (err, res) {
        if (err) return callback(err);
        if (res.statusCode === 304 && cachedResponse) { // Not Modified
          // prevent leakage of file handles
          res.body.resume();
          res = new Response(cachedResponse.statusCode, cachedResponse.headers, cachedResponse.body);
          res.url = urlString;
          res.fromCache = true;
          res.fromNotModified = true;
          return callback(null, res);
        } else if ((cache.canCache ? cache : cacheUtils).canCache(res)) {
          // prevent leakage of file handles
          cachedResponse && cachedResponse.body.resume();
          var cachedResponseBody = new PassThrough();
          var resultResponseBody = new PassThrough();
          res.body.on('data', function (data) { cachedResponseBody.write(data); resultResponseBody.write(data); });
          res.body.on('end', function () { cachedResponseBody.end(); resultResponseBody.end(); });
          var responseToCache = new Response(res.statusCode, res.headers, cachedResponseBody);
          var resultResponse = new Response(res.statusCode, res.headers, resultResponseBody);
          responseToCache.requestHeaders = rawHeaders;
          responseToCache.requestTimestamp = timestamp;
          cache.setResponse(urlString, responseToCache);
          return callback(null, resultResponse);
        } else {
          // prevent leakage of file handles
          cachedResponse && cachedResponse.body.resume();
          return callback(null, res);
        }
      });
    });
  }

  function attempt(n) {
    request(method, urlString, {
      allowRedirectHeaders: options.allowRedirectHeaders,
      headers: rawHeaders,
      agent: agent,
      timeout: options.timeout
    }, function (err, res) {
      var retry = err || res.statusCode >= 400;
      if (typeof options.retry === 'function') {
        retry = options.retry(err, res, n + 1);
      }
      if (n >= (options.maxRetries | 5)) {
        retry = false;
      }
      if (retry) {
        var delay = options.retryDelay;
        if (typeof options.retryDelay === 'function') {
          delay = options.retryDelay(err, res, n + 1);
        }
        delay = delay || 200;
        setTimeout(function () {
          attempt(n + 1);
        }, delay);
      } else {
        callback(null, res);
      }
    });
  }
  if (options.retry && method === 'GET') {
    return attempt(0);
  }

  var responded = false;

  var req = protocols[url.protocol.replace(/\:$/, '')].request({
    host: url.hostname,
    port: url.port,
    path: url.path,
    method: method,
    headers: rawHeaders,
    agent: agent
  }, function (res) {
    var end = Date.now();
    if (responded) return res.resume();
    responded = true;
    var result = new Response(res.statusCode, res.headers, res);
    result.url = urlString;
    callback(null, result);
  }).on('error', function (err) {
    if (responded) return;
    responded = true;
    callback(err);
  });

  var start = Date.now();
  function onTimeout() {
    if (responded) return;
    responded = true;
    req.abort();
    var duration = Date.now() - start;
    var err = new Error('Request timed out after ' + duration + 'ms');
    err.timeout = true;
    err.duration = duration;
    callback(err);
  }
  if (options.socketTimeout) {
    req.setTimeout(options.socketTimeout, onTimeout);
  }
  if (options.timeout) {
    setTimeout(onTimeout, options.timeout);
  }
  if (duplex) {
    return req;
  } else {
    req.end();
  }
}

function isRedirect(statusCode) {
  return statusCode === 301 || statusCode === 302 || statusCode === 303 || statusCode === 307 || statusCode === 308;
}
