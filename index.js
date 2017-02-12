
var input = 'Just a simple string';
var parser = require('./parser').parser;
var Lexer = require('./src/lexer');

// var parser = Parser();
var lexer = Lexer();
parser.lexer = lexer;

module.exports = function(input) {
  return parser.parse(input);
}
