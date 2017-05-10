# parse-css-font

[![NPM version](http://img.shields.io/npm/v/parse-css-font.svg?style=flat)](https://www.npmjs.org/package/parse-css-font)
[![npm license](http://img.shields.io/npm/l/parse-css-font.svg?style=flat-square)](https://www.npmjs.org/package/parse-css-font)
[![Travis Build Status](https://img.shields.io/travis/jedmao/parse-css-font.svg?label=unix)](https://travis-ci.org/jedmao/parse-css-font)

[![npm](https://nodei.co/npm/parse-css-font.svg?downloads=true)](https://nodei.co/npm/parse-css-font/)

Parses the CSS [font property](https://developer.mozilla.org/en-US/docs/Web/CSS/font#font-variant-css21).

## Installation

```
$ npm install parse-css-font [--save[-dev]]
```

## Usage

```js
var parseCssFont = require('parse-css-font');
parseCssFont('1rem "Roboto Condensed", sans-serif;');
/*
{
	size: '1rem',
	family: ['Roboto Condensed', 'sans-serif'],
	style: 'normal',
	variant: 'normal',
	weight: 'normal',
	stretch: 'normal',
	lineHeight: 'normal'
}
*/
```

See [the tests](https://github.com/jedmao/parse-css-font/blob/master/test/index.js) for more scenarios.

## Testing

```
$ npm test
```

This will run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.
