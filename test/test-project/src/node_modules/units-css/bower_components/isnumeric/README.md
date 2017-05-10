# isNumeric [![Build Status](https://travis-ci.org/leecrossley/isNumeric.png?branch=master)](https://travis-ci.org/leecrossley/isNumeric) [![npm version](https://badge.fury.io/js/isnumeric.png)](https://npmjs.org/package/isnumeric) [![devDependency Status](https://david-dm.org/leecrossley/isNumeric/dev-status.png)](https://david-dm.org/leecrossley/isNumeric#info=devDependencies)

Determine if a JavaScript object is numeric.

### Using npm

```
npm install isnumeric
```

To then include isnumeric in your node app:

```
var isNumeric = require("isnumeric");
```

### Direct dependency

Download the minified version [here](http://bit.ly/isnumeric), reference the js file and isNumeric will become a global variable.


## Truthy test cases

### Integers

```javascript
expect(isNumeric(1)).toBeTruthy();
expect(isNumeric(-1)).toBeTruthy();
expect(isNumeric(0)).toBeTruthy();
expect(isNumeric("1")).toBeTruthy();
expect(isNumeric("-1")).toBeTruthy();
expect(isNumeric("0")).toBeTruthy();
expect(isNumeric("1.")).toBeTruthy();
```

### Max / min numbers

```javascript
expect(isNumeric(Number.MAX_VALUE)).toBeTruthy();
expect(isNumeric(Number.MIN_VALUE)).toBeTruthy();
```

### Octals

```javascript
expect(isNumeric(0144)).toBeTruthy();
expect(isNumeric("0144")).toBeTruthy();
```

### Hexadecimals

```javascript
expect(isNumeric(0xFF)).toBeTruthy();
expect(isNumeric("0xFF")).toBeTruthy();
```

### Floating-points

```javascript
expect(isNumeric(1.1)).toBeTruthy();
expect(isNumeric(0.1)).toBeTruthy();
expect(isNumeric(-1.1)).toBeTruthy();
expect(isNumeric(-0.1)).toBeTruthy();
expect(isNumeric("1.1")).toBeTruthy();
expect(isNumeric("0.1")).toBeTruthy();
expect(isNumeric("-1.1")).toBeTruthy();
expect(isNumeric("-0.1")).toBeTruthy();
expect(isNumeric(".1")).toBeTruthy();
```

### Exponentials

```javascript
expect(isNumeric(3e5)).toBeTruthy();
expect(isNumeric(123e-2)).toBeTruthy();
expect(isNumeric("3e5")).toBeTruthy();
expect(isNumeric("123e-2")).toBeTruthy();
```

### Decimal commas

```javascript
expect(isNumeric(1,1)).toBeTruthy();
expect(isNumeric("1,1")).toBeTruthy();
```