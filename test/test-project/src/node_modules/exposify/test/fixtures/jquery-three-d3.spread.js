'use strict';

var $ = require('jquery')
  , d3 = require('d3')
  // this one just here to show that other stuff doesn't get changed
  , path = require('path');

function getThree() {
  return (function () {
    // this one is kinda hidden
    return require('three');
  })()
}

var go = module.exports = function () {
  // super hidden require for r2d3
  return { jquery: $.jquery(), three: getThree().version, d3: d3.version, r2d3: require('d3').version };
};
