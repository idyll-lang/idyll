'use strict';

var $ = require('jquery')
  , three = require('three')
  , path = require('path');

var go = module.exports = function () {
  return { jquery: $.jquery(), three: three.version };
};
