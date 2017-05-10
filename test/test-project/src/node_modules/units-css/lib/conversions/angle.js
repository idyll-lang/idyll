/* eslint-env browser, node */

'use strict';

var angle = {'_default': 'deg'};

// Supported units:
// deg, grad, rad, turn

angle.deg = {
  'grad': function(value) {
    return value / 0.9;
  },

  'rad': function(value) {
    return value * (Math.PI / 180);
  },

  'turn': function(value) {
    return value / 360;
  }
};

angle.grad = {
  'deg': function(value) {
    return value * 0.9;
  }
};

angle.rad = {
  'deg': function(value) {
    return value / (Math.PI / 180);
  }
};

angle.turn = {
  'deg': function(value) {
    return value * 360;
  }
};

// Exports
module.exports = angle;
