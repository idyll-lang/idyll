'use strict'

module.exports = function dotParts (path) {
  var result = []
  var parts = path.split('.')
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    while (part[part.length - 1] === '\\') {
      part = part.slice(0, -1) + '.'
      part += parts[++i]
    }
    result.push(part)
  }
  return result
}
