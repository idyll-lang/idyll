# accessory [![Build Status](https://travis-ci.org/bendrucker/accessory.svg?branch=master)](https://travis-ci.org/bendrucker/accessory)

> Create property accessor/caller statements for dot paths


## Install

```
$ npm install --save accessory
```


## Usage

```js
var accessory = require('accessory')

accessory('window', 'foo.bar')
//=> window['foo']['bar']

accessory('window', 'foo\\.bar')
//=> window['foo.bar']

accessory('window', 'foo.bar(baz)')
//=> window['foo']['bar'](baz)
```

## API

#### `accessory(source, path)` -> `string`

##### source

*Required*  
Type: `string`

The source identifier which will prepend the accessors.

##### path

*Required*  
Type: `string`  

A dot property path, including function calls.


## License

MIT © [Ben Drucker](http://bendrucker.me)
