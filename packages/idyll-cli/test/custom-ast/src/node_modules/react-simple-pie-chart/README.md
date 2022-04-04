# React Simple Pie Chart

[![npm version](https://badge.fury.io/js/react-simple-pie-chart.svg)](http://badge.fury.io/js/react-simple-pie-chart)
[![Build Status](https://travis-ci.org/brigade/react-simple-pie-chart.svg?branch=master)](https://travis-ci.org/brigade/react-simple-pie-chart)

Need a simple `<svg>` pie chart and don't want to bring in any heavy
dependencies? You've come to the right place.

[Demo](http://jsfiddle.net/qgxyw3mp/3/)

![Example pie
chart](http://brigade.github.io/react-simple-pie-chart/example-pie-chart.svg)

## Installation

### npm

```bash
npm install react-simple-pie-chart --save
```

## Usage

```javascript
import PieChart from 'react-simple-pie-chart';
```

```javascript
<PieChart
  slices={[
    {
      color: '#f00',
      value: 10,
    },
    {
      color: '#0f0',
      value: 20,
    },
  ]}
/>
```

## Code of conduct

This project adheres to the [Open Code of Conduct][code-of-conduct]. By
participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/brigade/code-of-conduct

## License

[MIT][mit-license]

[mit-license]: ./LICENSE
