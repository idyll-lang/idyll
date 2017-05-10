'use strict'

module.exports = function replaceCode (text, replacements) {
  var offset = 0
  return replacements.reduce(function (text, update) {
    var start = update.start + offset
    var end = update.end + offset
    var replacement = update.replacement
    offset += (replacement.length - (end - start))
    return text.slice(0, start) + replacement + text.slice(end)
  }, text)
}
