
var parse = require('./src/parser');
var Lexer = require('./src/lexer');

module.exports = function(input) {
  var lex = Lexer();
  var lexResults = lex(input);
  var output = parse(lexResults);
  return output;
}
