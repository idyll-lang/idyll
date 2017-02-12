
var Lexer = require('lex');

module.exports = function() {
  var lexer = new Lexer();
  var inComponent = false;


  lexer.addRule(/^\s?#{1,6}/gm, function(lexeme) {
    this.yytext = lexeme;
    // console.log('HEADER ' + lexeme + ' ' + this.reject);
    return 'HEADER';
  });

  lexer.addRule(/\n?[^\[\n\]]+/, function(lexeme) {
    this.reject = inComponent;
    this.yytext = lexeme;
    // console.log('WORDS ' + lexeme + ' ' + this.reject);
    return 'WORDS';
  });

  lexer.addRule(/[ \t]+/, function(lexeme) {
    // console.log('SPACE ' + lexeme + ' ' + this.reject);
  });

  lexer.addRule(/ *\n{2} */, function(lexeme) {
    this.reject = inComponent;
    // console.log('BREAK ' + lexeme + ' ' + this.reject);
    this.yytext = '\n';
    return 'BREAK';
  });

  lexer.addRule(/\[/, function(lexeme) {
    inComponent = true;
    this.yytext = '[';
    // console.log('OPEN_BRACKET ' + lexeme + ' ' + this.reject);
    return 'OPEN_BRACKET';
  });

  lexer.addRule(/\]/, function(lexeme) {
    inComponent = false;
    this.yytext = ']';
    // console.log('CLOSE_BRACKET ' + lexeme + ' ' + this.reject);
    return 'CLOSE_BRACKET';
  });


  lexer.addRule(/\//, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = '/';
    // console.log('FORWARD_SLASH ' + lexeme + ' ' + this.reject);
    return 'FORWARD_SLASH';
  });

  lexer.addRule(/[^0-9:\s\/\]"'`\.][^:\s\/\]"'`\.]*/, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = lexeme;
    // console.log('COMPONENT_WORD ' + lexeme + ' ' + this.reject);
    return 'COMPONENT_WORD';
  });

  lexer.addRule(/`[^`]*`/, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = lexeme;
    // console.log('COMPONENT_WORD ' + lexeme + ' ' + this.reject);
    return 'EXPRESSION';
  });

  lexer.addRule(/[0-9]+\.?[0-9]*/, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = lexeme;
    // console.log('COMPONENT_WORD ' + lexeme + ' ' + this.reject);
    return 'NUMBER';
  });

  lexer.addRule(/"[^"]*"/, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = lexeme;
    // console.log('COMPONENT_WORD ' + lexeme + ' ' + this.reject);
    return 'STRING';
  });

  lexer.addRule(/:/, function(lexeme) {
    this.reject = !inComponent;
    this.yytext = ':';
    // console.log('PARAM_SEPARATOR ' + lexeme + ' ' + this.reject);
    return 'PARAM_SEPARATOR';
  });

  lexer.addRule(/\s*$/, function(lexeme) {
    // console.log('EOF ' + lexeme + ' ' + this.reject);
    return 'EOF';
  });

  return lexer;
}