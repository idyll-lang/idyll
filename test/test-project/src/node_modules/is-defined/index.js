'use strict'

module.exports = function isDefined (identifier) {
  return 'typeof ' + identifier + ' !== "undefined"'
}
