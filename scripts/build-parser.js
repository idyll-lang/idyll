var fs = require('fs');
var Parser = require('../src/parser');
var Lexer = require('../src/lexer');

var parser = Parser();
var lexer = Lexer();
parser.lexer = lexer;
var parserSource = parser.generate();
fs.writeFileSync('parser.js', parserSource);
