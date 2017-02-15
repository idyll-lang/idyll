
var expect = require('expect.js');
var Lexer = require('../src/lexer');
var parse = require('../src/parser');
var fs = require('fs');

describe('compiler', function() {

  describe('lexer', function() {
    it('should tokenize the input', function() {
      var lex = Lexer();
      var results = lex("Hello \n\nWorld! []");
      expect(results).to.eql("WORDS TOKEN_VALUE_START \"Hello \" TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START \"World! \" TOKEN_VALUE_END OPEN_BRACKET CLOSE_BRACKET EOF");
    });

    it('should tokenize the input with a complex component', function() {
      var lex = Lexer();
      var results = lex("Hello \n\nWorld! \n\n [VarDisplay var:v work:\"no\" /]");
      expect(results).to.eql("WORDS TOKEN_VALUE_START \"Hello \" TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START \"World! \" TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_WORD TOKEN_VALUE_START \"VarDisplay\" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START \"var\" TOKEN_VALUE_END PARAM_SEPARATOR COMPONENT_WORD TOKEN_VALUE_START \"v\" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START \"work\" TOKEN_VALUE_END PARAM_SEPARATOR STRING TOKEN_VALUE_START \"&quot;no&quot;\" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF");
    });

  //   it('should tokenize the parameters correctly', function() {
  //     var lex = Lexer();
  //     var results = lex("[VarDisplay var:v work:\"no\" key:`val` k:12.34 /]");
  //     expect(results.tokens).to.eql(['OPEN_BRACKET', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'STRING', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'EXPRESSION', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'NUMBER', 'FORWARD_SLASH', 'CLOSE_BRACKET', 'EOF']);
  //     expect(results.values).to.eql([null, 'VarDisplay', 'var', null, 'v', 'work', null, '"no"', 'key', null, '`val`', 'k', null, '12.34', null, null, null]);
  //   });

    it('should recognize headings', function() {
      var lex = Lexer();
      var results = lex("\n## my title");
      expect(results).to.eql('HEADER TOKEN_VALUE_START "##" TOKEN_VALUE_END WORDS TOKEN_VALUE_START " my title" TOKEN_VALUE_END EOF');
    });
  //   it('should handle newlines', function() {
  //     var lex = Lexer();
  //     var results = lex("\n\n\n\n lol \n\n");
  //     expect(results.tokens).to.eql(['BREAK', 'BREAK', 'WORDS', 'BREAK', 'EOF']);
  //     expect(results.values).to.eql([null, null, 'lol ', null, null]);
  //   });
  });

  describe('parser', function() {

  //   before(function() {
  //     console.log('ya');
  //     // var parser = Parser();
  //     // var lexer = Lexer();
  //     // parser.lexer = lexer;
  //     // var parserSource = parser.generate();
  //     // fs.writeFileSync('tmp-parser.js', parserSource);
  //   });

  //   after(function() {
  //     // fs.unlinkSync('tmp-parser.js');
  //   });

    it('should parse a simple string', function() {
      var input = 'Just a simple string';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql([['p', [], ['Just a simple string']]]);
    });
    it('should handle multiple blocks', function() {
      var input = 'Just a simple string \n\n with some whitespace';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql([['p', [], ['Just a simple string ']], ['p', [], ['with some whitespace']]]);
    });
    it('should parse a closed component', function() {
      var input = '[var /]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql([['var', [], []]]);
    });
    it('should parse a closed component', function() {
      var input = '[var name:"v1" value:5 /]\n\nJust a simple string plus a component \n\n [VarDisplay var:v1 /]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql([['var', [['name', ['value', 'v1']], ['value', ['value', 5]]], []], ['p', [], ['Just a simple string plus a component ']], ['VarDisplay', [['var', ['variable', 'v1']]] , []]]);
    });

    it('should parse an open component', function() {
      var input = '[Slideshow currentSlide:1]test test test[/Slideshow]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
    });

    it('should parse a nested component', function() {
      var input = '[Slideshow currentSlide:1]text and stuff \n\n lots of newlines.\n\n[OpenComponent key:"val" ][/OpenComponent][/Slideshow]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql(
        [
          ['Slideshow', [['currentSlide', ['value', 1]]],
            [
              ["p", [], ["text and stuff "]],
              ["p", [], ["lots of newlines."]],
              ["OpenComponent", [["key", ["value", "val"]]], []]
      ]]]);
    });
    // it('should handle an inline closed component', function() {
    //   var input = 'This is a normal text paragraph that [VarDisplay var:var /] has a component embedded in it.';
    //   var lex = Lexer();
    //   var lexResults = lex(input);
    //   var output = parse(lexResults);
    //   expect(output).to.eql([
    //     ['p', [], [
    //       'This is a normal text paragraph that ',
    //       ['VarDisplay', [['var', ['variable', 'var']]], []],
    //       ' has a component embedded in it.'
    //     ]]]);
    // });

    it('should handle a header', function() {
      var input = '## This is a header\n\n And this is a normal paragraph.';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(lexResults);
      expect(output).to.eql([
        ['h2', [], [
          ' This is a header']
        ],['p', [], [
          'And this is a normal paragraph.']
        ],
      ]);
    });
  })
});
