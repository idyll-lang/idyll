<!--**Introduction**-->
<!--| [API Reference](https://github.com/kristw/react-vega-lite/blob/master/docs/api.md)-->
<!--| [Demo](https://kristw.github.io/react-vega-lite)-->

# react-vega-lite [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]

<!--[![Build Status][travis-image]][travis-url]-->

Convert Vega spec into React class conveniently, inspired by this [tutorial](https://medium.com/@pbesh/react-and-vega-an-alternative-visualization-example-cd76e07dc1cd#.omslw1xy8) by @pbeshai

## Examples

- http://kristw.github.io/react-vega-lite/

## Install

```bash
# via npm
npm install react-vega-lite --save
# or via bower
bower install react-vega-lite --save
```

## Example code

There are two approaches to use this libary.

### Approach#1 Create class from spec, then get a React class to use

#### BarChart.js

```javascript
import React, { PropTypes } from 'react';
import {createClassFromLiteSpec} from 'react-vega-lite';

export default createClassFromLiteSpec('BarChart', {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
});
```

#### main.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from './BarChart.js';

const barData = {
  "values": [
    {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
    {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
    {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
  ]
};

ReactDOM.render(
  <BarChart data={barData} />,
  document.getElementById('bar-container')
);
```

### Approach#2 Use `<VegaLite>` generic class and pass in `spec` for dynamic component.

Provides a bit more flexibility, but at the cost of extra checks for spec changes.

#### main.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import VegaLite from 'react-vega-lite';

const spec = {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
};

const barData = {
  "values": [
    {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
    {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
    {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
  ]
};

ReactDOM.render(
  <VegaLite spec={spec} data={barData} />,
  document.getElementById('bar-container')
);
```

### Props

React class `VegaLite` and any output class from `createClassFromLiteSpec` have these properties:

- **width**:Number
- **height**:Number
- **padding**:Object
- **viewport**:Array
- **renderer**:String
- **className**:String
- **style**:Object

These five properties above correspond to [Vega's View Component API](https://github.com/vega/vega/wiki/Runtime#view-component-api)

- **data**:Object

### Static function

Any class created from `createClassFromLiteSpec` will have this method.

- Chart.**getSpec()** - return `spec`

## License

© 2016 [Krist Wongsuphasawat](http://kristw.yellowpigz.com)  ([@kristw](https://twitter.com/kristw)) Apache-2.0 License

[npm-image]: https://badge.fury.io/js/react-vega-lite.svg
[npm-url]: https://npmjs.org/package/react-vega-lite
[travis-image]: https://travis-ci.org/kristw/react-vega-lite.svg?branch=master
[travis-url]: https://travis-ci.org/kristw/react-vega-lite
[daviddm-image]: https://david-dm.org/kristw/react-vega-lite.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/kristw/react-vega-lite