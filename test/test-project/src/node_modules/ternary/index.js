'use strict'

module.exports = function ternary (condition, expr1, expr2) {
  return condition + ' ? ' + expr1 + ' : ' + expr2
}
