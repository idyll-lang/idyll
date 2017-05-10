# globo [![Build Status](https://travis-ci.org/bendrucker/globo.svg?branch=master)](https://travis-ci.org/bendrucker/globo)

> Turn module ids into global lookups that work in Node and the browser


## Install

```
$ npm install --save globo
```


## Usage

```js
var globalize = require('globo');

globo('_');
//=> (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null)
```

## API

#### `globo(id)` -> `string`

##### id

*Required*  
Type: `string`

A module id.


![globo](globo.jpg)


## License

MIT © [Ben Drucker](http://bendrucker.me)
