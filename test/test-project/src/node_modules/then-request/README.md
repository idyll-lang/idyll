# then-request

A request library that returns promises, inspired by request

[![Build Status](https://img.shields.io/travis/then/then-request/master.svg)](https://travis-ci.org/then/then-request)
[![Dependency Status](https://img.shields.io/david/then/then-request.svg)](https://david-dm.org/then/then-request)
[![NPM version](https://img.shields.io/npm/v/then-request.svg)](https://www.npmjs.org/package/then-request)

## Installation

    npm install then-request

## Usage

`request(method, url, options, callback?)`

e.g.

```js
var request = require('then-request');

request('GET', 'http://example.com').done(function (res) {
  console.log(res.getBody());
});
```

**Method:**

An HTTP method (e.g. `GET`, `POST`, `PUT`, `DELETE` or `HEAD`). It is not case sensitive.

**URL:**

A url as a string (e.g. `http://example.com`). Relative URLs are allowed in the browser.

**Options:**

 - `qs` - an object containing querystring values to be appended to the uri
 - `headers` - http headers (default: `{}`)
 - `body` - body for PATCH, POST and PUT requests.  Must be a `Buffer` or `String` (only strings are accepted client side)
 - `json` - sets `body` but to JSON representation of value and adds `Content-type: application/json`.  Does not have any affect on how the response is treated.
 - `cache` - only used in node.js (browsers already have their own caches) Can be `'memory'`, `'file'` or your own custom implementaton (see https://github.com/ForbesLindesay/http-basic#implementing-a-cache).
 - `followRedirects` - defaults to `true` but can be explicitly set to `false` on node.js to prevent then-request following redirects automatically.
 - `maxRedirects` - sets the maximum number of redirects to follow before erroring on node.js (default: `Infinity`)
 - `gzip` - defaults to `true` but can be explicitly set to `false` on node.js to prevent then-request automatically supporting the gzip encoding on responses.
 - `timeout` (default: `false`) - times out if no response is returned within the given number of milliseconds.
 - `socketTimeout` (default: `false`) - calls `req.setTimeout` internally which causes the request to timeout if no new data is seen for the given number of milliseconds.  This option is ignored in the browser.
 - `retry` (default: `false`) - retry GET requests.  Set this to `true` to retry when the request errors or returns a status code greater than or equal to 400 (can also be a function that takes `(err, req, attemptNo) => shouldRetry`)
 - `retryDelay` (default: `200`) - the delay between retries (can also be set to a function that takes `(err, res, attemptNo) => delay`)
 - `maxRetries` (default: `5`) - the number of times to retry before giving up.


**Callback / Returns:**

If a callback is provided it is called with `err` and `res`. If no callback is provided, a [Promise](https://www.promisejs.org/) is returned that eventually resolves to `res`.  The resulting Promise also has an additional `.getBody(encoding?)` method that is equivallent to calling `.then(function (res) { return res.getBody(encoding?); })`.

### Response

Note that even for status codes that represent an error, the promise will be resolved as the request succeeded.  You can call `getBody` if you want to error on invalid status codes.  The response has the following properties:

 - `statusCode` - a number representing the HTTP status code
 - `headers` - http response headers
 - `body` - a string if in the browser or a buffer if on the server
 - `url` - the URL that was requested (in the case of redirects on the server, this is the final url that was requested)

It also has a method `getBody(encoding?)` which looks like:

```js
function getBody(encoding) {
  if (this.statusCode >= 300) {
    var err = new Error('Server responded with status code ' + this.statusCode + ':\n' + this.body.toString(encoding));
    err.statusCode = this.statusCode;
    err.headers = this.headers;
    err.body = this.body;
    throw err;
  }
  return encoding ? this.body.toString(encoding) : this.body;
}
```

## License

  MIT
