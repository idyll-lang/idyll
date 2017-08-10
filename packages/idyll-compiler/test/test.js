
var expect = require('expect.js');
var Lexer = require('../src/lexer');
var parse = require('../src/parser');
var fs = require('fs');

describe('compiler', function() {

  describe('lexer', function() {
    it('should tokenize the input', function() {
      var lex = Lexer();
      var results = lex("Hello \n\nWorld! []");
      expect(results.tokens.join(' ')).to.eql("WORDS TOKEN_VALUE_START \"Hello \" TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START \"World\" TOKEN_VALUE_END WORDS TOKEN_VALUE_START \"!\" TOKEN_VALUE_END OPEN_BRACKET CLOSE_BRACKET EOF");
    });

    it('should tokenize the input with a complex component', function() {
      var lex = Lexer();
      var results = lex("Hello \n\nWorld \n\n [VarDisplay var:v work:\"no\" /]");
      expect(results.tokens.join(' ')).to.eql("WORDS TOKEN_VALUE_START \"Hello \" TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START \"World \" TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START \"VarDisplay\" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START \"var\" TOKEN_VALUE_END PARAM_SEPARATOR COMPONENT_WORD TOKEN_VALUE_START \"v\" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START \"work\" TOKEN_VALUE_END PARAM_SEPARATOR STRING TOKEN_VALUE_START \"&quot;no&quot;\" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF");
    });

    it('should recognize headings', function() {
      var lex = Lexer();
      var results = lex("\n## my title");
      expect(results.tokens.join(' ')).to.eql('HEADER_2 TOKEN_VALUE_START "my title" TOKEN_VALUE_END EOF');
    });
    it('should handle newlines', function() {
      var lex = Lexer();
      var results = lex("\n\n\n\n text \n\n");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START \"text\" TOKEN_VALUE_END EOF');
    });

    it('should handle markdown formating in a list element', function() {
      var lex = Lexer();
      var results = lex("- **test**");
      expect(results.tokens.join(' ')).to.eql('BREAK UNORDERED_LIST LIST_ITEM STRONG TOKEN_VALUE_START "test" TOKEN_VALUE_END LIST_END EOF');
    });

    it('should handle equations', function () {
      var lex = Lexer();
      var results = lex("[Equation]y = 0[/Equation]");
      expect(results.tokens.join(' ')).to.eql('OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "Equation" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "y = " TOKEN_VALUE_END WORDS TOKEN_VALUE_START "0" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "Equation" TOKEN_VALUE_END CLOSE_BRACKET EOF');
    });

    it('should handle backticks in a paragraph', function() {
      var lex = Lexer();
      var results = lex("regular text and stuff, then some `code`");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START "regular text and stuff, then some " TOKEN_VALUE_END INLINE_CODE TOKEN_VALUE_START "code" TOKEN_VALUE_END EOF');
    });

    it('should handle a markdown-style link in a paragraph', function() {
      var lex = Lexer();
      var results = lex("regular text and stuff, then a [link](https://idyll-lang.github.io/).");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START "regular text and stuff, then a " TOKEN_VALUE_END LINK TOKEN_VALUE_START "link" TOKEN_VALUE_END TOKEN_VALUE_START "https://idyll-lang.github.io/" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF');
    });

    it('should handle a markdown-style image', function() {
      var lex = Lexer();
      var results = lex("This is an image inline ![image](https://idyll-lang.github.io/logo-text.svg).");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START "This is an image inline " TOKEN_VALUE_END IMAGE TOKEN_VALUE_START "image" TOKEN_VALUE_END TOKEN_VALUE_START "https://idyll-lang.github.io/logo-text.svg" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF');
    });

    it('should handle a component name with a period', function() {
      var lex = Lexer();
      var results = lex("This component name has a period separator [component.val /].");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START "This component name has a period separator " TOKEN_VALUE_END OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START \"component.val\" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF');
    });

    it('should handle a component name with multiple periods', function() {
      var lex = Lexer();
      var results = lex("This component name has a period separator [component.val.v /].");
      expect(results.tokens.join(' ')).to.eql('WORDS TOKEN_VALUE_START "This component name has a period separator " TOKEN_VALUE_END OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START \"component.val.v\" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF');
    });

    it('should handle an i tag', function() {
      var lex = Lexer();
      var results = lex('[i]not even em[/i]');
      expect(results.tokens.join(' ')).to.eql('OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "i" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "not even em" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "i" TOKEN_VALUE_END CLOSE_BRACKET EOF');
    });

  });

  describe('parser', function() {
    it('should parse a simple string', function() {
      var input = 'Just a simple string';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['p', [], ['Just a simple string']]]);
    });
    it('should handle multiple blocks', function() {
      var input = 'Just a simple string \n\n with some whitespace';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['p', [], ['Just a simple string ']], ['p', [], ['with some whitespace']]]);
    });
    it('should parse a closed component', function() {
      var input = '[var /]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['var', [], []]]);
    });
    it('should parse a closed component', function() {
      var input = '[var name:"v1" value:5 /]\n\nJust a simple string plus a component \n\n [VarDisplay var:v1 /]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['var', [['name', ['value', 'v1']], ['value', ['value', 5]]], []], ['p', [], ['Just a simple string plus a component ']], ['VarDisplay', [['var', ['variable', 'v1']]] , []]]);
    });

    it('should parse an open component', function() {
      var input = '[Slideshow currentSlide:1]test test test[/Slideshow]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
    });

    it('should parse a nested component', function() {
      var input = '[Slideshow currentSlide:1]text and stuff \n\n lots of newlines.\n\n[OpenComponent key:"val" ][/OpenComponent][/Slideshow]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['Slideshow', [['currentSlide', ['value', 1]]],
            [
              ["p", [], ["text and stuff "]],
              ["p", [], ["lots of newlines."]],
              ["OpenComponent", [["key", ["value", "val"]]], []]
      ]]]);
    });
    it('should handle an inline closed component', function() {
      var input = 'This is a normal text paragraph that [VarDisplay var:var /] has a component embedded in it.';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([
        ['p', [], [
          'This is a normal text paragraph that ',
          ['VarDisplay', [['var', ['variable', 'var']]], []],
          ' has a component embedded in it.'
        ]]]);
    });

    it('should handle a header', function() {
      var input = '## This is a header\n\n And this is a normal paragraph.';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([
        ['h2', [], [
          'This is a header']
        ],['p', [], [
          ' And this is a normal paragraph.']
        ],
      ]);
    });

    it('should parse an open component with a break at the end', function() {
      var input = '[Slideshow currentSlide:1]text and stuff \n\n [/Slideshow]';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['Slideshow', [['currentSlide', ['value', 1]]],
            [
              "text and stuff "
            ]
          ]
      ]);
    });
    it('should parse a paragraph and code fence', function() {
      var input = 'text text text lots of text\n\n\n```\nvar code = true;\n```\n';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['p', [], ['text text text lots of text']],
          ['pre', [], [['code', [], ['var code = true;']]]]
        ]);
    });
    it('should parse a code fence with backticks inside', function() {
      var input = 'text text text lots of text\n\n\n````\n```\nvar code = true;\n```\n````\n';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['p', [], ['text text text lots of text']],
          ['pre', [], [['code', [], ['```\nvar code = true;\n```']]]]
        ]);
    });
    it('should parse inline code with backticks inside', function() {
      var input = 'text text text lots of text `` `var code = true;` ``\n';
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['p', [], ['text text text lots of text ', ['code', [], ['`var code = true;`']]]]
        ]);
    });
    it('should handle backticks in a paragraph', function() {
      var input = "regular text and stuff, then some `code`";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['p', [], ['regular text and stuff, then some ', ['code', [], ['code']]]]
        ]);
    });


    it('should accept negative numbers', function() {
      var input = "[component prop:-10 /]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['component', [['prop', ['value', -10]]], []]
        ]);

    });

    it('should accept positive numbers', function() {
      var input = "[component prop:10 /]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['component', [['prop', ['value', 10]]], []]
        ]);

    });

    it('should handle booleans', function() {
      const input = "[component prop:true /]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['component', [['prop', ['value', true]]], []]
        ]);
    });

    it('should handle booleans in backticks', function() {
      const input = "[component prop:`true` /]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['component', [['prop', ['expression', 'true']]], []]
        ]);
    });

    it('should handle italics and bold', function() {
      const input = "regular text and stuff, then some *italics* and some **bold**.";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['p', [], ['regular text and stuff, then some ', ['em', [], ['italics']], ' and some ', ['strong', [], ['bold']], '.']]
        ]);
    });

    it('should handle unordered list', function() {
      const input = "* this is the first unordered list item\n* this is the second unordered list item";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
      [
        ['ul', [], [
          ['li', [], ['this is the first unordered list item']],
          ['li', [], ['this is the second unordered list item']]
        ]],
      ]);
    });

    it('should handle ordered list', function() {
      const input = "1. this is the first ordered list item\n2. this is the second ordered list item";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql(
        [
          ['ol', [], [
            ['li', [], ['this is the first ordered list item']],
            ['li', [], ['this is the second ordered list item']]
          ]
        ]
      ]);
    });

    it('should handle inline links', function() {
      const input = "If you want to define an [inline link](https://idyll-lang.github.io) in the standard markdown style, you can do that.";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([["p",[],["If you want to define an ",["a",[["href",["value","https://idyll-lang.github.io"]]],["inline link"]]," in the standard markdown style, you can do that."]]]
      );
    });
    it('should handle inline images', function() {
      const input = "If you want to define an ![inline image](https://idyll-lang.github.io/logo-text.svg) in the standard markdown style, you can do that.";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([["p",[],["If you want to define an ",["img",[["src",["value","https://idyll-lang.github.io/logo-text.svg"]], ["alt", ["value", "inline image"]]],[]]," in the standard markdown style, you can do that."]]]
      );
    });

    it('should handle lines that start with bold or italic', function() {
      const input = "**If** I start a line with bold this should work,\nwhat if I\n\n*start with an italic*?";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([["p",[],[["strong",[],["If"]]," I start a line with bold this should work,\nwhat if I"]],["p",[],[["em",[],["start with an italic"]],"?"]]]
      );
    })
    it('should handle component name with a period', function() {
      const input = "This component name has a period separator [component.val /].";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([["p",[],["This component name has a period separator ",["component.val",[],[]],"."]]]);
    })
    it('should handle component name with multiple periods', function() {
      const input = "This component name has a period separator [component.val.v /].";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([["p",[],["This component name has a period separator ",["component.val.v",[],[]],"."]]]);
    })

    it('should handle strong text with a p', function() {
      const input = "**p a**";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['strong', [], ['p a']]]);
    })

    it('should handle strong emphasized text using asterisks', function() {
      const input = "***test***";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['strong', [], [['em', [], ['test']]]]]);
    })

    it('should handle strong emphasized text using underscores', function() {
      const input = "___test___";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['strong', [], [['em', [], ['test']]]]]);
    })

    it('should merge consecutive word blocks', function() {
      const input = "[Equation]y = 0[/Equation]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['Equation', [], ['y = 0']]]);
    })

    it('should not put smartquotes in code blocks', function() {
      const input = "`Why 'hello' there`";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['code', [], ["Why 'hello' there"]]]);
    })
    it('should handle a language in a codeblock ', function() {
      const input = "```json\n{}\n```";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['CodeHighlight', [['language', ['value', 'json']]], ["{}"]]]);
    })


    it('should handle an i tag', function() {
      const input = "[i]not even em[/i]";
      var lex = Lexer();
      var lexResults = lex(input);
      var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      expect(output).to.eql([['i', [], ['not even em']]]);
    })
  });

  describe('error handling', function() {
    it('record line and column number of an error', function() {
      input = 'This string contains an un-closed component [BadComponent key:"val" ] ';
      var lex = Lexer();
      var lexResults = lex(input);
      try {
        var output = parse(input, lexResults.tokens.join(' '), lexResults.positions);
      } catch(err) {
        expect(err.row).to.be(1);
        expect(err.column).to.be(70);
      }
    });
  });
});
