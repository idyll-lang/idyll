var test = require('tape')
  , unquote = require('..')

test('should unquote double quotes properly', function (t) {
  t.plan(1)
  t.equal(unquote('"hello, world"'), 'hello, world', 'should be equal')
})

test('should unquote escaped quotes properly', function (t) {
  t.plan(1)
  t.equal(unquote('\'hello, world\''), 'hello, world', 'should be equal')
})
