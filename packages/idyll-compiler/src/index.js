
var parse = require('./parser');
var Lexer = require('./lexer');

const cleanNewlines = (input) => {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

module.exports = function(input, options) {
  input = cleanNewlines(input);
  options = Object.assign({}, { spellcheck: false, smartquotes: true }, options || {});
  var lex = Lexer();
  var lexResults = lex(input);
  var output = parse(input, lexResults.tokens.join(' '), lexResults.positions, options);
  return output;
}
