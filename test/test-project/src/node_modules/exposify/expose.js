'use strict';

var mapObject = require('map-obj');
var replaceRequires = require('replace-requires');
var globalize = require('globo')

module.exports = function expose (replacements, code) {
  replacements = mapObject(replacements, function (moduleId, globalId) {
    return [moduleId, globalize(globalId)]
  })
  return replaceRequires(code, replacements)
}
