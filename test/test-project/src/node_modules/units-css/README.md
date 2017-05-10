[![Travis CI status](https://img.shields.io/travis/alexdunphy/units.svg)](https://travis-ci.org/alexdunphy/units)
[![Coveralls status](https://img.shields.io/coveralls/alexdunphy/units.svg)](https://coveralls.io/r/alexdunphy/units)
[![dependencies status](https://img.shields.io/david/alexdunphy/units.svg)](https://david-dm.org/alexdunphy/units)
[![devDependencies status](https://img.shields.io/david/dev/alexdunphy/units.svg)](https://david-dm.org/alexdunphy/units#info=devDependencies)

[![Sauce Labs status](https://saucelabs.com/browser-matrix/units-css.svg)](https://saucelabs.com/u/units-css)

# Units

Parse length and angle CSS values and convert between units.

#### Supported units:

**Length:** `%, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw`

**Angle:** `deg, grad, rad, turn`

## Install

**Bower:** `bower install -S units-css`

**npm:** `npm i -S units-css`

(One object is exported:)

```javascript
var units = require('units-css');
```

## API

### #parse(value, property)

Extract the numeric value and unit from a formatted CSS value:

```javascript
units.parse('1px'); // {'value': 1, 'unit': 'px'}
```

Or, passing only a value or only a unit:

```javascript
units.parse(1);    // {'value': 1, 'unit': ''}
units.parse('px'); // {'value': 0, 'unit': 'px'}
```

Optionally pass a CSS property name as the second argument to enable property-specific defaults:

```javascript
// Absent units
units.parse(1, 'width');   // {'value': 1, 'unit': 'px'}
units.parse(1, 'opacity'); // {'value': 1, 'unit': ''}
units.parse(1, 'rotate');  // {'value': 1, 'unit': 'deg'}

// Absent values
units.parse('', 'width');   // {'value': 0, 'unit': 'px'}
units.parse('', 'opacity'); // {'value': 1, 'unit': ''}
```

##### Transforms
`transform` should not be passed directly as the property name - instead specify a transform keyword (e.g. `rotate`).

### #convert(to, value, element, property)

Convert a formatted CSS value to a different unit ([see supported units](#supported-units)). For example:

```javascript
units.convert('cm', '12px'); // 0.3175
```

##### Element
Conversions to/from `%, ch, em, ex` require an element be passed as the third argument. This should be the element to which the converted CSS value applies/will apply:

```javascript
units.convert('em', '16px', document.getElementById('some-element')); // 1em
```

##### Property
Conversions to/from `%` require a CSS property name (e.g. _width_) be passed as the fourth argument. This should be the matching property name for the converted CSS value:

```javascript
units.convert('%', '16px', document.getElementById('some-element'), 'translateX'); // 10%
```

##### Transforms
`transform` should not be passed directly as the property name - instead specify a transform keyword (e.g. `rotate`).

### #getDefaultValue(property)

Get a default numeric value for a CSS property:

```javascript
units.getDefaultValue('opacity');    // 1
units.getDefaultValue('scale');      // 1
units.getDefaultValue('scale3d');    // 1
units.getDefaultValue('scaleX');     // 1
units.getDefaultValue('scaleY');     // 1
units.getDefaultValue('scaleZ');     // 1
units.getDefaultValue('lineHeight'); // 1
```

All other properties will return `0`, for example:

```javascript
units.getDefaultValue('width'); // 0
```

### #getDefaultUnit(property)

Get a default unit for a CSS property:

```javascript
units.getDefaultUnit('opacity');    // ''
units.getDefaultUnit('rotate');     // 'deg'
units.getDefaultUnit('rotate3d');   // 'deg'
units.getDefaultUnit('rotateX');    // 'deg'
units.getDefaultUnit('rotateY');    // 'deg'
units.getDefaultUnit('rotateZ');    // 'deg'
units.getDefaultUnit('skew');       // 'deg'
units.getDefaultUnit('skewX');      // 'deg'
units.getDefaultUnit('skewY');      // 'deg'
units.getDefaultUnit('scale');      // ''
units.getDefaultUnit('scale3d');    // ''
units.getDefaultUnit('scaleX');     // ''
units.getDefaultUnit('scaleY');     // ''
units.getDefaultUnit('scaleZ');     // ''
units.getDefaultUnit('lineHeight'); // ''
```

All other properties will return `'px'`, for example:

```javascript
units.getDefaultUnit('width'); // 'px'
```

## Environment

Server-side use is supported, though converting to/from the following units requires a browser environment: `%, ch, em, ex, rem, vh, vmax, vmin, vw`.

## Development

1. Clone repo and `npm install`
2. Make changes and ensure linting (`gulp lint`) & tests (`gulp test`) pass (combined task: `gulp dev`)
3. Create distributable files (`gulp dist`) - combined dev + dist task: `gulp`

Use `gulp watch` to run linter and tests on each file change (equivalent to manually running `gulp dev`).
