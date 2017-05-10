[![Travis CI status](https://img.shields.io/travis/alexdunphy/viewport.svg)](https://travis-ci.org/alexdunphy/viewport)
[![Coveralls status](https://img.shields.io/coveralls/alexdunphy/viewport.svg)](https://coveralls.io/r/alexdunphy/viewport)
[![devDependencies status](https://img.shields.io/david/dev/alexdunphy/viewport.svg)](https://david-dm.org/alexdunphy/viewport#info=devDependencies)

[![Sauce Labs status](https://saucelabs.com/browser-matrix/alexdunphy-viewport.svg)](https://saucelabs.com/u/alexdunphy-viewport)

# Viewport

Simple utility for watching and retrieving browser viewport width, height, vmin and vmax.

`documentElement.clientWidth` is used (rather than `window.innerWidth`), so reported viewport dimensions will exclude scrollbar dimensions.

## Install

#### Bower

`bower install -S viewport-dimensions`

#### npm

`npm i -S viewport-dimensions`

(One object is exported:)

```javascript
var viewport = require('viewport');
```

## API

### #width()
Returns _{number}_ - Browser viewport width.

```javascript
viewport.width(); // (e.g.) 1024
```

### #height()
Returns _{number}_ - Browser viewport height.

```javascript
viewport.height(); // (e.g.) 768
```

### #max()
Returns _{number}_ - Maximum browser dimension (width/height).

```javascript
viewport.max(); // (e.g.) 1024
```

### #min()
Returns _{number}_ - Minimum browser dimension (width/height).

```javascript
viewport.height(); // (e.g.) 768
```

### #setDimensions()
Set internal dimension references to current browser viewport width and height.

```javascript
viewport.setDimensions();
```

## Environment

Won't generate errors if run server-side, but won't do anything too useful either.

## Development

1. Clone repo and `npm install`
2. Make changes and ensure linting (`gulp lint`) & tests (`gulp test`) pass (combined task: `gulp dev`)
3. Create distributable files (`gulp dist`) - combined dev + dist task: `gulp`

Use `gulp watch` to run linter and tests on each file change (equivalent to manually running `gulp dev`).
