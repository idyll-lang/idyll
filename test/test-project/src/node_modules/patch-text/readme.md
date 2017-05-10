# patch-text [![Build Status](https://travis-ci.org/bendrucker/patch-text.svg?branch=master)](https://travis-ci.org/bendrucker/patch-text)

> Make multiple changes to a block of text by providing start and end indices and replacement text


## Install

```
$ npm install --save patch-text
```


## Usage

```js
var patch = require('patch-text');
var text = 'Hello guys!'
var updated = patch(text, [
  {
    start: 0,
    end: 5,
    replacement: 'Hi'
  },
  {
    start: 7,
    end: 9,
    replacement: 'al'
  }
])
// => 'Hi gals!'
```

Your patches shouldn't overlap, but they can shrink or increase the character count and your patches will still apply to the right text. 

## API

#### `patch(text, patches)` -> `string`

##### text

*Required*  
Type: `string`

The text to patch.

##### patches

*Required*  
Type: `array[object]`

The patches to apply to the text, each with:

* start (number)
* end (number)
* replacement (string)


## License

MIT © [Ben Drucker](http://bendrucker.me)
