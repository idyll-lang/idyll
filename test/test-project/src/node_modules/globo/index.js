'use strict'

var ternary = require('ternary')
var isDefined = require('is-defined')
var access = require('accessory')

module.exports = function globalize (property) {
  return parenthesize(ternary(
    isDefined('window'),
    access('window', property),
    ternary(
      isDefined('global'),
      access('global', property),
      null
    )
  ))
}

function parenthesize (string) {
  return '(' + string + ')'
}
