
var parse = require('./src/parser');
var Lexer = require('./src/lexer');

module.exports = function(input, options) {
  options = Object.assign({}, { spellcheck: false, smartquotes: true }, options || {});
  var lex = Lexer();
  var lexResults = lex(input);
  var output = parse(input, lexResults.tokens.join(' '), lexResults.positions, options);
  return output;
}
