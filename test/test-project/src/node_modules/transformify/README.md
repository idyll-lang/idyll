# transformify [![build status](https://secure.travis-ci.org/thlorenz/transformify.png)](http://travis-ci.org/thlorenz/transformify)

Takes a synchronous function that transforms a string and converts it into a transform compatible with browserify, catw and mutiny.

```js
var transformify = require('transformify');

function toUpper(s) {
  return s.toUpperCase();
}

require('fs').createReadStream(__filename)
  .pipe(transformify(toUpper)(/* file not used */))
  .pipe(process.stdout);
```

### Output

```
VAR TRANSFORMIFY = REQUIRE('TRANSFORMIFY')

FUNCTION TOUPPER(S) {
  RETURN S.TOUPPERCASE();
}

REQUIRE('FS').CREATEREADSTREAM(__FILENAME)
  .PIPE(TRANSFORMIFY(TOUPPER)(/* FILE NOT USED */))
  .PIPE(PROCESS.STDOUT);
```

## Installation

    npm install transformify

## API

### transformify(fn)
```
/**
 * Takes a synchronous function that transforms a string and returns a transform compatible with browserify, catw and mutiny.
 * 
 * @name transformify
 * @function
 * @param {Function(String):String} fn 
 * @return {Function(String):TransformStream} function that returns a transform stream
 */
```

## License

MIT
