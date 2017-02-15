
var parse = require('./src/parser');
var Lexer = require('./src/lexer');

module.exports = function(input) {
  var lex = Lexer();
  var lexResults = lex(input);
  console.log(lexResults);
  var output = parse(lexResults);
  console.log(output);
  return output;
}
