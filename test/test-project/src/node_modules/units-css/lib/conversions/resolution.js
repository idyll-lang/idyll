/* eslint-env browser, node */

'use strict';

// Imports
var utilities = require('./../utilities');

var resolution = {'_default': 'dpi'};

// Supported units:
// dpi, dpcm, dppx

resolution.dpi = {
  'dpcm': function(value) {
    return value / 2.54;
  },

  'dppx': function(value) {
    return value / utilities.DPI;
  }
};

resolution.dpcm = {
  'dpi': function(value) {
    return value * 2.54;
  }
};

resolution.dppx = {
  'dpi': function(value) {
    return value * utilities.DPI;
  }
};

// Exports
module.exports = resolution;
