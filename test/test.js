
var expect = require('expect.js');
var Lexer = require('../src/lexer');
var Parser = require('../src/parser');
var fs = require('fs');

describe('compiler', function() {

  describe('lexer', function() {
    it('should tokenize the input', function() {
      var lexer = Lexer();
      lexer.input = "Hello \n\nWorld! []";

      var results = [];
      var curResults = lexer.lex();
      while (curResults) {
        results.push(curResults);
        curResults = lexer.lex();
      }
      expect(results).to.eql(['WORDS', 'BREAK', 'WORDS', 'OPEN_BRACKET', 'CLOSE_BRACKET', 'EOF']);
    });

    it('should tokenize the input with a complex component', function() {
      var lexer = Lexer();

      lexer.input = "Hello \n\nWorld! \n\n [VarDisplay var:v work:\"no\" /]";

      var results = [];
      var curResults = lexer.lex();
      while (curResults) {
        results.push(curResults);
        curResults = lexer.lex();
      }
      expect(results).to.eql(['WORDS', 'BREAK', 'WORDS', 'BREAK', 'OPEN_BRACKET', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'STRING', 'FORWARD_SLASH', 'CLOSE_BRACKET', 'EOF']);
    });

    it('should tokenize the parameters correctly', function() {
      var lexer = Lexer();

      lexer.input = "[VarDisplay var:v work:\"no\" key:`val` k:12.34 /]";

      var results = [];
      var curResults = lexer.lex();
      while (curResults) {
        results.push(curResults);
        curResults = lexer.lex();
      }
      expect(results).to.eql(['OPEN_BRACKET', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'COMPONENT_WORD', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'STRING', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'EXPRESSION', 'COMPONENT_WORD', 'PARAM_SEPARATOR', 'NUMBER', 'FORWARD_SLASH', 'CLOSE_BRACKET', 'EOF']);
    });

    it('should recognize headings', function() {
      var lexer = Lexer();

      lexer.input = "\n## my title";

      var results = [];
      var curResults = lexer.lex();
      while (curResults) {
        results.push(curResults);
        curResults = lexer.lex();
      }
      expect(results).to.eql(['HEADER', 'WORDS', 'EOF']);
    });
    it('should handle newlines', function() {
      var lexer = Lexer();

      lexer.input = "\n\n\n\n lol \n\n";

      var results = [];
      var curResults = lexer.lex();
      while (curResults) {
        results.push(curResults);
        curResults = lexer.lex();
      }
      expect(results).to.eql(['BREAK', 'BREAK', 'WORDS', 'BREAK', 'EOF']);
    });

  });

  describe('parser', function() {

    before(function() {
      console.log('ya');
      // var parser = Parser();
      // var lexer = Lexer();
      // parser.lexer = lexer;
      // var parserSource = parser.generate();
      // fs.writeFileSync('tmp-parser.js', parserSource);
    });

    after(function() {
      // fs.unlinkSync('tmp-parser.js');
    });

    it('should parse a simple string', function() {
      var input = 'Just a simple string';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
      console.log(output);
    });
    it('should handle multiple blocks', function() {
      var input = 'Just a simple string \n\n with some whitespace';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
      console.log(output);
    });
    it('should parse a closed component', function() {
      var input = '[var name:"v1" value:5 /]\n\nJust a simple string plus a component \n\n [VarDisplay var:v1 /]\n';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
      console.log(JSON.stringify(output));
    });
    it('should parse an open component', function() {
      var input = '[Slideshow currentSlide:1]text and stuff \n\n lots of newlines. [ClosedComponent key:"val" /][ClosedComponent/][/Slideshow]';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
      console.log(JSON.stringify(output));
    });
    it('should parse a nested open component', function() {
      var input = '[Slideshow currentSlide:1][Slide]First Slide[/Slide][Slide key:"val"]Second [Dynamic /] Slide.[/Slide][/Slideshow]';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
    });
    it('should handle an inline closed component', function() {
      var input = 'This is a normal text paragraph that [VarDisplay var:var /] has a component embedded in it.';
      var parser = Parser();
      var lexer = Lexer();
      parser.lexer = lexer;
      var output = parser.parse(input);
      console.log(JSON.stringify(output));
    });
  })
});
  