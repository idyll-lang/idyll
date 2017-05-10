/* eslint-env browser, node */

'use strict';

// Imports
var conversions = require('./conversions');
var isNumeric = require('isnumeric/isNumeric');

var units = {};


// Expose conversion functions
//------------------------------------------------------------------------------

units.conversions = conversions;


// Properties with non default unit/value
//------------------------------------------------------------------------------

var properties = units.properties = {};

properties.lineHeight =
properties.opacity =
properties.scale =
properties.scale3d =
properties.scaleX =
properties.scaleY =
properties.scaleZ = {
  'defaultUnit': '',
  'defaultValue': 1
};

properties.rotate =
properties.rotate3d =
properties.rotateX =
properties.rotateY =
properties.rotateZ =
properties.skew =
properties.skewX =
properties.skewY = {
  'defaultUnit': 'deg'
};

properties.resolution = {
  'defaultUnit': 'dpi',
  'defaultValue': 96
};


// Public interface
//------------------------------------------------------------------------------

units.convert = function(to, value, element, property) {
  var parts = units.parse(value, property);

  if (to === '_default') {
    to = units.getDefaultUnit(property);
  }

  return to === parts.unit
    ? parts.value
    : units.processConversion(parts.unit, to, parts.value, element, property);
};

units.parse = function(value, property) {
  var parts = {};
  var matches;

  if (isNumeric(value)) {
    parts.value = value;
    parts.unit = property
      ? units.getDefaultUnit(property)
      : '';
  } else {
    matches = value.toString().trim().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);

    if (matches !== null) {
      parts.value = matches[1];
      parts.unit = matches[2];
    } else {
      parts.unit = value;
      parts.value = property
        ? units.getDefaultValue(property)
        : 0;
    }
  }

  parts.value = parseFloat(parts.value);

  return parts;
};

units.getDefaultValue = function(property) {
  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultValue !== 'undefined'
    ? properties[property].defaultValue
    : 0;
};

units.getDefaultUnit = function(property) {
  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultUnit !== 'undefined'
    ? properties[property].defaultUnit
    : 'px';
};


// Protected methods
//------------------------------------------------------------------------------

units.processConversion = function(fromUnits, toUnits, value, element, property) {
  var type = units.getConversionType(fromUnits);
  var method;

  if (typeof type[fromUnits][toUnits] === 'function') {
    method = type[fromUnits][toUnits];
  } else {
    method = type[type._default][toUnits];
    value = type[fromUnits][type._default](value, element, property); // Use default unit conversion as an interstitial step
  }

  return method(value, element, property);
};

units.getConversionType = function(fromUnits) {
  var property;
  var type = null;

  for (property in conversions) {
    /* istanbul ignore else */
    if (conversions.hasOwnProperty(property) && typeof conversions[property][fromUnits] !== 'undefined') {
      type = conversions[property];
      break;
    }
  }

  return type;
};

// Exports
module.exports = units;
