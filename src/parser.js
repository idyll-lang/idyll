const grammar = require('./grammar');
const nearley = require("nearley");

// Create a Parser object from our grammar.

module.exports = function(str) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  p.feed(str);
  var results = p.results;
  if (results.length) {
    return results[0];
  }
  throw new Error('No parse results');
}
