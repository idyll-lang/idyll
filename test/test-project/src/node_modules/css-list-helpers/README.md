# css-list-helpers

[![NPM version](http://img.shields.io/npm/v/css-list-helpers.svg?style=flat)](https://www.npmjs.org/package/css-list-helpers)
[![npm license](http://img.shields.io/npm/l/css-list-helpers.svg?style=flat-square)](https://www.npmjs.org/package/css-list-helpers)
[![Travis Build Status](https://img.shields.io/travis/jedmao/css-list-helpers.svg?label=unix)](https://travis-ci.org/jedmao/css-list-helpers)

[![npm](https://nodei.co/npm/css-list-helpers.svg?downloads=true)](https://nodei.co/npm/css-list-helpers/)

Helper methods for splitting CSS lists (i.e., by spaces or commas), extracted from [PostCSS#list](https://github.com/postcss/postcss/blob/master/lib/list.es6).

## Installation

```
$ npm install css-list-helpers [--save[-dev]]
```

## Usage

```js
var listHelpers = require('css-list-helpers');
listHelpers.splitBySpaces(' 0 a(b / c) "d e" ');   // ['0', 'a(b / c)', '"d e"']
listHelpers.splitByCommas(' 0, a(b / c), "d e" '); // ['0', 'a(b / c)', '"d e"']
listHelpers.split('a/fn(b / c)', ['/']);           // ['a', 'fn(b / c)']
```

## Testing

```
$ npm test
```

This will run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.
