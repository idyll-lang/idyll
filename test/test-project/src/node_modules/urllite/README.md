urllite.js
==========

urllite is a URL parser for nodejs and the browser. It's meant to be a
replacement for [URL decomposition IDL attributes][1]—especially when you want
to support non-browser environments like node. Its main goal is to be tiny
enough to be bundled with browser builds of JS libraries.

urllite is designed to be modular so that you can include only the parts you
need. For example, URL resolution is a separate extension.

Its core API is based on the [URLUtils] interface (the properties of "a"
HTMLElements and `window.location`):

```javascript
var url = urllite('http://u:p@example.com:10/a/b/c?one=1&two=2#three');
url.origin    // "http://example.com:10"
url.protocol  // "http:"
url.username  // "u"
url.password  // "p"
url.host      // "example.com:10"
url.hostname  // "example.com"
url.port      // "10"
url.pathname  // "/a/b/c"
url.search    // "?one=1&two=2"
url.hash      // "#three"
```


## Usage


### In the browser

```html
<script src="urllite.js"></script>
<script>
    var url = urllite('http://u:p@example.com:10/a/b/c?one=1&two=2#three');
</script>
```

You can also use urllite as an AMD module.


### In node

```javascript
var urllite = require('urllite');
var url = urllite('http://u:p@example.com:10/a/b/c?one=1&two=2#three');
```


### In your own libraries

You can compile urllite into your own libraries using a tool like [browserify].


## API

The `urllite` function is the main entry point. Use it to parse a URL:

```javascript
var url = urllite('http://example.com');
console.log(url.host);  // => "example.com"
```

All URL methods are available as extensions. In node, all extensions are
available by default. For the browser, you can require extensions selectively
and create custom builds with only the extensions you need.


### `resolve()`

Resolves the URL to the given base.

```javascript
var url = urllite('dogs/are/awesome');
console.log(url.resolve('http://animals.com').toString());  // => "http://animals.com/dogs/are/awesome"
```


### `relativize()`

Returns a new URL which is a relative to the provided URL.

```javascript
var url = urllite('http://animals.com/dogs/are/awesome');
console.log(url.relativize('http://animals.com').toString());  // => "dogs/are/awesome"
```


[1]: http://www.w3.org/TR/url/#the-url-decomposition-idl-attributes
[URLUtils]: https://developer.mozilla.org/en-US/docs/Web/API/URLUtils
[browserify]: http://browserify.org
