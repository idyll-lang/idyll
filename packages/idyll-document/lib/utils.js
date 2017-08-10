'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var flattenObject = function flattenObject(name, obj) {
  var output = {};
  if (obj === undefined || obj === null) {
    return output;
  }
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
      var results = flattenObject(key, val);
      Object.keys(results).forEach(function (result) {
        output[name + result] = results[result];
      });
    } else {
      output[name + key] = val;
    }
  });
  return output;
};

module.exports = {
  flattenObject: flattenObject
};