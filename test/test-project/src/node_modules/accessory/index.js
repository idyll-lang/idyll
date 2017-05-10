'use strict'

var split = require('dot-parts')
var balanced = require('balanced-match')
var ap = require('ap')
var findCall = ap.partial(balanced, '(', ')')

module.exports = function createAccessor (source, path) {
  return split(path).reduce(accumulate, source)
}

function accumulate (statement, property) {
  var callString = ''
  function append (body) {
    callString += '(' + body + ')'
  }
  var call = findCall(property)
  if (call) {
    property = call.pre
    append(call.body)
    var post = call.post
  }
  while (post) {
    call = findCall(post)
    append(call.body)
    post = call.post
  }
  return statement + "['" + property + "']" + callString
}
