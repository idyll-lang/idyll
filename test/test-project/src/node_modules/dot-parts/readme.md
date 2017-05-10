# dot-parts [![Build Status](https://travis-ci.org/bendrucker/dot-parts.svg?branch=master)](https://travis-ci.org/bendrucker/dot-parts)

> Split a dot property into its parts


## Install

```
$ npm install --save dot-parts
```


## Usage

```js
var dotParts = require('dot-parts')

// normal
dotParts('foo.bar.baz')
//=> ['foo', 'bar', 'baz']

// escaping with \\
dotParts('foo\\.bar', 'baz')
//=> ['foo.bar', 'baz']
```

## API

#### `dotParts(path)` -> `array[string]`

##### path

*Required*  
Type: `string`

A dot-delimeted path.


## License

MIT © [Ben Drucker](http://bendrucker.me)
