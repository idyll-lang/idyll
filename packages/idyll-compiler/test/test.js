var expect = require('expect.js');
var Lexer = require('../src/lexer');
var compile = require('../src');
var fs = require('fs');
var AST = require('idyll-ast').converters;

describe('compiler', function() {
  describe('lexer', function() {
    it('should tokenize the input', function() {
      var lex = Lexer();
      var results = lex('Hello \n\nWorld! []');
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Hello " TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START "World" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "! " TOKEN_VALUE_END OPEN_BRACKET CLOSE_BRACKET EOF'
      );
    });

    it('should tokenize the input with a complex component', function() {
      var lex = Lexer();
      var results = lex('Hello \n\nWorld \n\n [VarDisplay var:v work:"no" /]');
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Hello " TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START "World " TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "VarDisplay" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "var" TOKEN_VALUE_END PARAM_SEPARATOR COMPONENT_WORD TOKEN_VALUE_START "v" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "work" TOKEN_VALUE_END PARAM_SEPARATOR STRING TOKEN_VALUE_START "&quot;no&quot;" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF'
      );
    });
    it('should support single quotes around strings', function() {
      var lex = Lexer();
      var results = lex("Hello \n\nWorld \n\n [VarDisplay var:v work:'no' /]");
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Hello " TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START "World " TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "VarDisplay" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "var" TOKEN_VALUE_END PARAM_SEPARATOR COMPONENT_WORD TOKEN_VALUE_START "v" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "work" TOKEN_VALUE_END PARAM_SEPARATOR STRING TOKEN_VALUE_START "&quot;no&quot;" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF'
      );
    });

    it('should recognize headings', function() {
      var lex = Lexer();
      var results = lex('\n## my title');
      expect(results.tokens.join(' ')).to.eql(
        'BREAK HEADER_2 WORDS TOKEN_VALUE_START "my title" TOKEN_VALUE_END HEADER_END EOF'
      );
    });

    it('should recognize block quotes', function() {
      var lex = Lexer();
      var results = lex('\n> My blockquote');
      expect(results.tokens.join(' ')).to.eql(
        'BREAK QUOTE_START WORDS TOKEN_VALUE_START "My blockquote" TOKEN_VALUE_END QUOTE_END EOF'
      );
    });

    it('should handle newlines', function() {
      var lex = Lexer();
      var results = lex('\n\n\n\n text \n\n');
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "text" TOKEN_VALUE_END EOF'
      );
    });

    it('should ignore escaped brackets', function() {
      var lex = Lexer();
      var results = lex('Text with a range, \\[0, 20\\].');
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Text with a range, " TOKEN_VALUE_END WORDS TOKEN_VALUE_START "[" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "0" TOKEN_VALUE_END WORDS TOKEN_VALUE_START ", " TOKEN_VALUE_END WORDS TOKEN_VALUE_START "2" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "0" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "]" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF'
      );
    });

    it('should handle markdown formating in a list element', function() {
      var lex = Lexer();
      var results = lex('- **test**');
      expect(results.tokens.join(' ')).to.eql(
        'BREAK UNORDERED_LIST LIST_ITEM STRONG WORDS TOKEN_VALUE_START "test" TOKEN_VALUE_END STRONG_END LIST_END EOF'
      );
    });

    it('should handle equations', function() {
      var lex = Lexer();
      var results = lex('[Equation]y = 0[/Equation]');
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "equation" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "y = 0" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "equation" TOKEN_VALUE_END CLOSE_BRACKET EOF'
      );
    });

    it('should handle backticks in a paragraph', function() {
      var lex = Lexer();
      var results = lex('regular text and stuff, then some `code`');
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "regular text and stuff, then some " TOKEN_VALUE_END INLINE_CODE TOKEN_VALUE_START "code" TOKEN_VALUE_END EOF'
      );
    });

    it('should handle a markdown-style link in a paragraph', function() {
      var lex = Lexer();
      var results = lex(
        'regular text and stuff, then a [link](https://idyll-lang.github.io/).'
      );
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "regular text and stuff, then a " TOKEN_VALUE_END LINK TOKEN_VALUE_START "link" TOKEN_VALUE_END TOKEN_VALUE_START "https://idyll-lang.github.io/" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF'
      );
    });

    it('should handle a markdown-style image', function() {
      var lex = Lexer();
      var results = lex(
        'This is an image inline ![image](https://idyll-lang.github.io/logo-text.svg).'
      );
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "This is an image inline " TOKEN_VALUE_END IMAGE TOKEN_VALUE_START "image" TOKEN_VALUE_END TOKEN_VALUE_START "https://idyll-lang.github.io/logo-text.svg" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF'
      );
    });

    it('should handle a component name with a period', function() {
      var lex = Lexer();
      var results = lex(
        'This component name has a period separator [component.val /].'
      );
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "This component name has a period separator " TOKEN_VALUE_END OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component.val" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF'
      );
    });

    it('should handle a component name with multiple periods', function() {
      var lex = Lexer();
      var results = lex(
        'This component name has a period separator [component.val.v /].'
      );
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "This component name has a period separator " TOKEN_VALUE_END OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component.val.v" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET WORDS TOKEN_VALUE_START "." TOKEN_VALUE_END EOF'
      );
    });

    it('should handle an i tag', function() {
      var lex = Lexer();
      var results = lex('[i]not even em[/i]');
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "i" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "not even em" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "i" TOKEN_VALUE_END CLOSE_BRACKET EOF'
      );
    });

    it('should ignore comments', function() {
      var lex = Lexer();
      var results = lex(`
        Text. / Not a comment.
        // Comment
        // Second comment
        [component]//not a comment
          // comment inside components
        [/component]// is a comment

        not a comment: https://stuff.com
      `);
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Text. " TOKEN_VALUE_END WORDS TOKEN_VALUE_START "/ Not a comment.\n        " TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "/" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "/not a comment\n          " TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END CLOSE_BRACKET BREAK WORDS TOKEN_VALUE_START "not a comment: https:" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "/" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "/stuff.com" TOKEN_VALUE_END EOF'
      );
    });

    it('ordered lists with a space after the bullet are parsed as a list', function() {
      var input = `
        1. bar
      `;
      var lex = Lexer();
      var results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'BREAK ORDERED_LIST LIST_ITEM WORDS TOKEN_VALUE_START "bar" TOKEN_VALUE_END LIST_END EOF'
      );
    });

    it('ordered lists with no space after the bullet are not parsed as a list', function() {
      var input = `
        1.bar
      `;
      var lex = Lexer();
      var results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "1" TOKEN_VALUE_END WORDS TOKEN_VALUE_START ".bar" TOKEN_VALUE_END EOF'
      );
    });

    it('unordered lists with a space after the bullet are parsed as a list', function() {
      var input = `
        - bar
      `;
      var lex = Lexer();
      var results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'BREAK UNORDERED_LIST LIST_ITEM WORDS TOKEN_VALUE_START "bar" TOKEN_VALUE_END LIST_END EOF'
      );
    });

    it('unordered lists with no space after the bullet are not parsed as a list', function() {
      var input = `
        -bar
      `;
      var lex = Lexer();
      var results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "-bar" TOKEN_VALUE_END EOF'
      );
    });

    it('should handle a header', function() {
      var input = `
        ## This is a header
        And this is a normal paragraph.

        [component]# This header is inside a component.[/component]
      `;
      var lex = Lexer();
      var results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'BREAK HEADER_2 WORDS TOKEN_VALUE_START "This is a header" TOKEN_VALUE_END HEADER_END WORDS TOKEN_VALUE_START "And this is a normal paragraph." TOKEN_VALUE_END BREAK OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END CLOSE_BRACKET BREAK HEADER_1 WORDS TOKEN_VALUE_START "This header is inside a component." TOKEN_VALUE_END HEADER_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END CLOSE_BRACKET EOF'
      );
    });
    it('should handle numbers with leading decimals as prop values in components', function() {
      const input = `[component number:.1 /]`;
      const lex = Lexer();
      const results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "number" TOKEN_VALUE_END PARAM_SEPARATOR NUMBER TOKEN_VALUE_START ".1" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF'
      );
    });
    it('should reject numbers with multiple decimal points', function() {
      const input = `[component number:.1.1 /]`;
      const lex = Lexer();
      expect(() => lex(input)).to.throwException();
    });
    it('should handle numbers with decimals as prop values in components', function() {
      const input = `[component number:1.1 /]`;
      const lex = Lexer();
      const results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "component" TOKEN_VALUE_END COMPONENT_WORD TOKEN_VALUE_START "number" TOKEN_VALUE_END PARAM_SEPARATOR NUMBER TOKEN_VALUE_START "1.1" TOKEN_VALUE_END FORWARD_SLASH CLOSE_BRACKET EOF'
      );
    });

    it('should handle equation alias', function() {
      var lex = Lexer({}, { Eq: 'equation' });
      var results = lex('[Eq]y = 0[/Eq]');
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "equation" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "y = 0" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "equation" TOKEN_VALUE_END CLOSE_BRACKET EOF'
      );
    });
    it('should handle code alias', function() {
      var lex = Lexer({}, { Cd: 'code' });
      var results = lex('[Cd]y = 0[/Cd]');
      expect(results.tokens.join(' ')).to.eql(
        'OPEN_BRACKET COMPONENT_NAME TOKEN_VALUE_START "code" TOKEN_VALUE_END CLOSE_BRACKET WORDS TOKEN_VALUE_START "y = 0" TOKEN_VALUE_END OPEN_BRACKET FORWARD_SLASH COMPONENT_NAME TOKEN_VALUE_START "code" TOKEN_VALUE_END CLOSE_BRACKET EOF'
      );
    });
    it("symbols or numbers at end of paragraph doesn't remove paragraph break", function() {
      const input = `
        Idyll is based on Markdown!

        Idyll posts are designed to support interaction and
        data-driven graphics.
      `;
      const lex = Lexer();
      const results = lex(input);
      expect(results.tokens.join(' ')).to.eql(
        'WORDS TOKEN_VALUE_START "Idyll is based on Markdown" TOKEN_VALUE_END WORDS TOKEN_VALUE_START "!" TOKEN_VALUE_END BREAK WORDS TOKEN_VALUE_START "Idyll posts are designed to support interaction and\n        data-driven graphics." TOKEN_VALUE_END EOF'
      );
    });
  });

  describe('parser', function() {
    it('should parse a simple string', function() {
      var input = 'Just a simple string';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['p', [], ['Just a simple string']]]]
        ])
      );
    });
    it('should handle multiple blocks', function() {
      var input = 'Just a simple string \n\n with some whitespace';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['p', [], ['Just a simple string ']],
              ['p', [], ['with some whitespace']]
            ]
          ]
        ])
      );
    });
    it('should parse a closed var', function() {
      var input = '[var /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([['var', [], []]])
      );
    });
    it('should parse a closed component', function() {
      var input =
        '[var name:"v1" value:5 /]\n\nJust a simple string plus a component \n\n [VarDisplay var:v1 /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['var', [['name', ['value', 'v1']], ['value', ['value', 5]]], []],
          [
            'TextContainer',
            [],
            [
              ['p', [], ['Just a simple string plus a component ']],
              ['VarDisplay', [['var', ['variable', 'v1']]], []]
            ]
          ]
        ])
      );
    });

    it('should parse an open component', function() {
      var input = '[Slideshow currentSlide:1]test test test[/Slideshow]';
      var output = compile(input, { async: false });
    });

    it('should parse a nested component', function() {
      var input =
        '[Slideshow currentSlide:1]text and stuff \n\n lots of newlines.\n\n[OpenComponent key:"val" ][/OpenComponent][/Slideshow]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'Slideshow',
                [['currentSlide', ['value', 1]]],
                [
                  ['p', [], ['text and stuff ']],
                  ['p', [], ['lots of newlines.']],
                  ['OpenComponent', [['key', ['value', 'val']]], []]
                ]
              ]
            ]
          ]
        ])
      );
    });
    it('should handle an inline closed component', function() {
      var input =
        'This is a normal text paragraph that [VarDisplay var:var /] has a component embedded in it.';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'This is a normal text paragraph that ',
                  ['VarDisplay', [['var', ['variable', 'var']]], []],
                  ' has a component embedded in it.'
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle a header', function() {
      var input = `
        ## This is a header
        And this is a normal paragraph. This is # not a header.

        [component]# This header is inside a component.[/component]

        [component]This is not a # header inside a component.[/component]

        [component /]

        # Header

        End text
      `;
      console.log(compile(input, { async: false }));
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['h2', [], ['This is a header']],
              [
                'p',
                [],
                ['And this is a normal paragraph. This is # not a header.']
              ],
              [
                'component',
                [],
                [['h1', [], ['This header is inside a component.']]]
              ],
              ['component', [], ['This is not a # header inside a component.']],
              ['component', [], []],
              ['h1', [], ['Header']],
              ['p', [], ['End text']]
            ]
          ]
        ])
      );
    });
    it('should handle quotes', function() {
      var input = `
        > This is a quote
        And this is a normal paragraph. This is > not a quote.

        [component]> This quote is inside a component.[/component]

        [component]This is not a > quote inside a component.[/component]

        [component /]

        > quote

        End text
      `;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['blockquote', [], ['This is a quote']],
              [
                'p',
                [],
                ['And this is a normal paragraph. This is > not a quote.']
              ],
              [
                'component',
                [],
                [['blockquote', [], ['This quote is inside a component.']]]
              ],
              ['component', [], ['This is not a > quote inside a component.']],
              ['component', [], []],
              ['blockquote', [], ['quote']],
              ['p', [], ['End text']]
            ]
          ]
        ])
      );
    });

    it('should ignore front-matter', function() {
      var input = `
---
key: value
title: Title
---
## This is a header
And this is a normal paragraph. This is # not a header.

[component]# This header is inside a component.[/component]

[component]This is not a # header inside a component.[/component]

[component /]

# Header

End text
      `;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['h2', [], ['This is a header']],
              [
                'p',
                [],
                ['And this is a normal paragraph. This is # not a header.']
              ],
              [
                'component',
                [],
                [['h1', [], ['This header is inside a component.']]]
              ],
              ['component', [], ['This is not a # header inside a component.']],
              ['component', [], []],
              ['h1', [], ['Header']],
              ['p', [], ['End text']]
            ]
          ]
        ])
      );
    });
    it('should handle multiple headers', function() {
      var input = `
        # This is a header
        ## This is a header

        ### This is a header

        #### This is a header
      `;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['h1', [], ['This is a header']],
              ['h2', [], ['This is a header']],
              ['h3', [], ['This is a header']],
              ['h4', [], ['This is a header']]
            ]
          ]
        ])
      );
    });
    it('should handle a header that starts with a number', function() {
      var input = `
        # 1. This is a header
        ## 2. This is also a header

        ### 3. This too.
      `;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['h1', [], ['1', '. This is a header']],
              ['h2', [], ['2', '. This is also a header']],
              ['h3', [], ['3', '. This too.']]
            ]
          ]
        ])
      );
    });

    it('should parse an open component with a break at the end', function() {
      var input = '[Slideshow currentSlide:1]text and stuff \n\n [/Slideshow]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'Slideshow',
                [['currentSlide', ['value', 1]]],
                ['text and stuff ']
              ]
            ]
          ]
        ])
      );
    });
    it('should parse a paragraph and code fence', function() {
      var input =
        'text text text lots of text\n\n\n```\nvar code = true;\n```\n';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['p', [], ['text text text lots of text']],
              ['pre', [], [['code', [], ['var code = true;']]]]
            ]
          ]
        ])
      );
    });
    it('should parse a code fence with backticks inside', function() {
      var input =
        'text text text lots of text\n\n\n````\n```\nvar code = true;\n```\n````\n';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['p', [], ['text text text lots of text']],
              ['pre', [], [['code', [], ['```\nvar code = true;\n```']]]]
            ]
          ]
        ])
      );
    });
    it('should parse inline code with backticks inside', function() {
      var input = 'text text text lots of text `` `var code = true;` ``\n';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'text text text lots of text ',
                  ['code', [], ['`var code = true;`']]
                ]
              ]
            ]
          ]
        ])
      );
    });
    it('should handle backticks in a paragraph', function() {
      var input = 'regular text and stuff, then some `code`';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                ['regular text and stuff, then some ', ['code', [], ['code']]]
              ]
            ]
          ]
        ])
      );
    });

    it('should ignore comments', function() {
      var input = `
        Text. / Not a comment.
        // Comment
        // Second comment
        [component]//not a comment
          // comment inside components
        [/component]// is a comment

        not a comment: https://stuff.com
      `;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['p', [], ['Text. / Not a comment.\n        ']],
              ['component', [], ['//not a comment\n          ']],
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      'not a comment: ',
                      [
                        'a',
                        [['href', ['value', 'https://stuff.com']]],
                        ['https://stuff.com']
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should accept negative numbers', function() {
      var input = '[component prop:-10 /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['component', [['prop', ['value', -10]]], []]]]
        ])
      );
    });

    it('should accept positive numbers', function() {
      var input = '[component prop:10 /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['component', [['prop', ['value', 10]]], []]]]
        ])
      );
    });

    it('should accept numbers /w a leading decimal point', function() {
      const input = '[component prop:.1 /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['component', [['prop', ['value', 0.1]]], []]]]
        ])
      );
    });

    it('should handle booleans', function() {
      const input = '[component prop:true /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [['component', [['prop', ['value', true]]], []]]
          ]
        ])
      );
    });

    it('should handle booleans in backticks', function() {
      const input = '[component prop:`true` /]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [['component', [['prop', ['expression', 'true']]], []]]
          ]
        ])
      );
    });

    it('should handle italics and bold', function() {
      const input =
        'regular text and stuff, then some *italics* and some **bold**.';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'regular text and stuff, then some ',
                  ['em', [], ['italics']],
                  ' and some ',
                  ['strong', [], ['bold']],
                  '.'
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle unordered list', function() {
      const input =
        '* this is the first unordered list item\n* this is the second unordered list item';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'ul',
                [],
                [
                  ['li', [], ['this is the first unordered list item']],
                  ['li', [], ['this is the second unordered list item']]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle ordered list', function() {
      const input =
        '1. this is the first ordered list item\n2. this is the second ordered list item';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'ol',
                [],
                [
                  ['li', [], ['this is the first ordered list item']],
                  ['li', [], ['this is the second ordered list item']]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle inline links', function() {
      const input =
        'If you want to define an [inline link](https://idyll-lang.github.io) in the standard markdown style, you can do that.';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'If you want to define an ',
                  [
                    'a',
                    [['href', ['value', 'https://idyll-lang.github.io']]],
                    ['inline link']
                  ],
                  ' in the standard markdown style, you can do that.'
                ]
              ]
            ]
          ]
        ])
      );
    });
    it('should handle inline images', function() {
      const input =
        'If you want to define an ![inline image](https://idyll-lang.github.io/logo-text.svg) in the standard markdown style, you can do that.';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'If you want to define an ',
                  [
                    'img',
                    [
                      [
                        'src',
                        ['value', 'https://idyll-lang.github.io/logo-text.svg']
                      ],
                      ['alt', ['value', 'inline image']]
                    ],
                    []
                  ],
                  ' in the standard markdown style, you can do that.'
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle lines that start with bold or italic', function() {
      const input =
        '**If** I start a line with bold this should work,\nwhat if I\n\n*start with an italic*?';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  ['strong', [], ['If']],
                  ' I start a line with bold this should work,\nwhat if I'
                ]
              ],
              ['p', [], [['em', [], ['start with an italic']], '?']]
            ]
          ]
        ])
      );
    });
    it('should handle component name with a period', function() {
      const input =
        'This component name has a period separator [component.val /].';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'This component name has a period separator ',
                  ['component.val', [], []],
                  '.'
                ]
              ]
            ]
          ]
        ])
      );
    });
    it('should handle component name with multiple periods', function() {
      const input =
        'This component name has a period separator [component.val.v /].';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  'This component name has a period separator ',
                  ['component.val.v', [], []],
                  '.'
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle strong text with a p', function() {
      const input = '**p a**';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([['TextContainer', [], [['strong', [], ['p a']]]]])
      );
    });

    it('should handle strong emphasized text using asterisks', function() {
      const input = '***test***';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['strong', [], [['em', [], ['test']]]]]]
        ])
      );
    });

    it('should handle strong emphasized text using underscores', function() {
      const input = '___test___';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['strong', [], [['em', [], ['test']]]]]]
        ])
      );
    });

    it('should handle strong emphasized text using mixed asterisks and underscores - 1', function() {
      const input = '_**test**_';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['em', [], [['strong', [], ['test']]]]]]
        ])
      );
    });
    it('should handle strong emphasized text using mixed asterisks and underscores - 2', function() {
      const input = '**_test_**';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['strong', [], [['em', [], ['test']]]]]]
        ])
      );
    });

    it('should merge consecutive word blocks', function() {
      const input = '[Equation]y = 0[/Equation]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['equation', [], ['y = 0']]]]
        ])
      );
    });

    it('should not put smartquotes in code blocks', function() {
      const input = "`Why 'hello' there`";
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['code', [], ["Why 'hello' there"]]]]
        ])
      );
    });
    it('should handle a language in a codeblock ', function() {
      const input = '```json\n{}\n```';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [['CodeHighlight', [['language', ['value', 'json']]], ['{}']]]
          ]
        ])
      );
    });

    it('should handle an i tag', function() {
      const input = '[i]not even em[/i]';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([['TextContainer', [], [['i', [], ['not even em']]]]])
      );
    });

    it('should not insert extra div tags', function() {
      const input = `
      [Slideshow]
        [Slide/]
        [Slide/]

        [Slide/]
      [/Slideshow]`;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'Slideshow',
                [],
                [['Slide', [], []], ['Slide', [], []], ['Slide', [], []]]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle items nested in a header', function() {
      const input = `# My header is **bold**!`;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [['h1', [], ['My header is ', ['strong', [], ['bold']], '!']]]
          ]
        ])
      );
    });

    it('should handle full width components and elements', function() {
      const input = `
        This is text

        [FullWidth]
        This is full width
        [/FullWidth]

        [div fullWidth:true /]

        This is not full width
      `;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['p', [], ['This is text']]]],
          [
            'div',
            [['className', ['value', 'fullWidth']]],
            ['\n        This is full width\n        ']
          ],
          ['div', [], []],
          ['TextContainer', [], [['p', [], ['This is not full width']]]]
        ])
      );
    });
    it('should handle lists followed by emphasised text', function() {
      const input = `
- foo
- bar

*Wow!*
      `;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              ['ul', [], [['li', [], ['foo']], ['li', [], ['bar']]]],
              ['em', [], ['Wow', '!']]
            ]
          ]
        ])
      );
    });

    it('should preserve space between inline blocks - 1', function() {
      const input = `*text* __other text__`;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [['em', [], ['text']], ' ', ['strong', [], ['other text']]]
              ]
            ]
          ]
        ])
      );
    });
    it('should preserve space between inline blocks - 2', function() {
      const input = `[em]text[/em] [b]other text[/b]`;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [['p', [], [['em', [], ['text']], ' ', ['b', [], ['other text']]]]]
          ]
        ])
      );
    });

    it('should handle equations with strange things inside - 1', function() {
      const input = `[equation display:true]\sum_{j=0}^n x^{j} + \sum x^{k}[/equation]`;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'equation',
                [['display', ['value', true]]],
                ['sum_{j=0}^n x^{j} + sum x^{k}']
              ]
            ]
          ]
        ])
      );
    });

    it('should handle equations with strange things inside - 2', function() {
      const input = `
      [equation display:true]\sum_{j=0}^n x^{j} + \sum_{k=0}^n x^{k}
      [/equation]
      `;

      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'equation',
                [['display', ['value', true]]],
                ['sum_{j=0}^n x^{j} + sum_{k=0}^n x^{k}']
              ]
            ]
          ]
        ])
      );
    });

    it('should handle code blocks with parens inside', function() {
      const input = `[code](n - 1)!/2 possible paths[/code]`;
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          ['TextContainer', [], [['code', [], ['(n - 1)!/2 possible paths']]]]
        ])
      );
    });

    // it('should respect linebreaks', function() {
    //   const input = `
    //   How many
    //   lines should

    //   this text
    //   be
    //   on
    //   ?
    //   `;
    //   expect(compile(input, { async: false })).to.eql(AST.convertV1ToV2(
    //   [
    //     ['TextContainer', [], [
    //       ['code', [], [
    //         '(n - 1)!/2 possible paths'
    //       ]]
    //     ]]
    //   ]);
    // });
  });

  describe('error handling', function() {
    it('record line and column number of an error', function() {
      const input =
        'This string contains an un-closed component [BadComponent key:"val" ] ';
      try {
        const output = compile(input, { async: false });
      } catch (err) {
        expect(err.row).to.be(1);
        expect(err.column).to.be(70);
      }
    });
  });

  describe('plugins', function() {
    it('should handle a synchronous post-processing plugin', function(done) {
      const input = 'Hello World';
      compile(input, {
        postProcessors: [
          ast => {
            return AST.convertV2ToV1(ast).concat([
              ['TextContainer', [], [':)']]
            ]);
          }
        ]
      }).then(function(output) {
        expect(output).to.eql([
          ['TextContainer', [], [['p', [], ['Hello World']]]],
          ['TextContainer', [], [':)']]
        ]);
        done();
      });
    });

    it('should handle an asynchronous post-processing plugin', function(done) {
      const input = 'Hello World';
      compile(input, {
        postProcessors: [
          (ast, callback) => {
            callback(
              null,
              AST.convertV2ToV1(ast).concat([['TextContainer', [], [':)']]])
            );
          }
        ]
      }).then(function(output) {
        expect(output).to.eql([
          ['TextContainer', [], [['p', [], ['Hello World']]]],
          ['TextContainer', [], [':)']]
        ]);
        done();
      });
    });

    it('should handle multiple synchronous post-processing plugins', function(done) {
      const input = 'Hello World';
      compile(input, {
        postProcessors: [
          ast => {
            return AST.convertV2ToV1(ast).concat([
              ['TextContainer', [], [':)']]
            ]);
          },
          ast => {
            return ast.concat([['TextContainer', [], [':(']]]);
          }
        ]
      }).then(function(output) {
        expect(output).to.eql([
          ['TextContainer', [], [['p', [], ['Hello World']]]],
          ['TextContainer', [], [':)']],
          ['TextContainer', [], [':(']]
        ]);
        done();
      });
    });

    it('should handle multiple asynchronous post-processing plugins', function(done) {
      const input = 'Hello World';
      compile(input, {
        postProcessors: [
          (ast, callback) => {
            callback(
              null,
              AST.convertV2ToV1(ast).concat([['TextContainer', [], [':)']]])
            );
          },
          (ast, callback) => {
            callback(null, ast.concat([['TextContainer', [], [':(']]]));
          }
        ]
      }).then(function(output) {
        expect(output).to.eql([
          ['TextContainer', [], [['p', [], ['Hello World']]]],
          ['TextContainer', [], [':)']],
          ['TextContainer', [], [':(']]
        ]);
        done();
      });
    });

    it('should handle mixed synchronous and asynchronous post-processing plugins', function(done) {
      const input = 'Hello World';
      compile(input, {
        postProcessors: [
          (ast, callback) => {
            callback(
              null,
              AST.convertV2ToV1(ast).concat([['TextContainer', [], ['1']]])
            );
          },
          ast => {
            return ast.concat([['TextContainer', [], ['2']]]);
          },
          (ast, callback) => {
            callback(null, ast.concat([['TextContainer', [], ['3']]]));
          },
          ast => {
            return ast.concat([['TextContainer', [], ['4']]]);
          }
        ]
      }).then(function(output) {
        expect(output).to.eql([
          ['TextContainer', [], [['p', [], ['Hello World']]]],
          ['TextContainer', [], ['1']],
          ['TextContainer', [], ['2']],
          ['TextContainer', [], ['3']],
          ['TextContainer', [], ['4']]
        ]);
        done();
      });
    });

    it('should handle a link', function() {
      const input = 'https://www.google.com/';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      [
                        'a',
                        [['href', ['value', 'https://www.google.com/']]],
                        ['https://www.google.com/']
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle one link in text', function() {
      const input = 'Here is a link to website https://www.google.com/';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      'Here is a link to website ',
                      [
                        'a',
                        [['href', ['value', 'https://www.google.com/']]],
                        ['https://www.google.com/']
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle one links in between text', function() {
      const input =
        'Here is a link to website https://www.google.com/ Click here!';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      'Here is a link to website ',
                      [
                        'a',
                        [['href', ['value', 'https://www.google.com/']]],
                        ['https://www.google.com/']
                      ],
                      ' Click here!'
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle two links in between text', function() {
      const input =
        'Here is a link to website https://www.google.com/ Click here! https://www.go.com/';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      'Here is a link to website ',
                      [
                        'a',
                        [['href', ['value', 'https://www.google.com/']]],
                        ['https://www.google.com/']
                      ],
                      ' Click here! ',
                      [
                        'a',
                        [['href', ['value', 'https://www.go.com/']]],
                        ['https://www.go.com/']
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle a link before any text', function() {
      const input = 'https://www.google.com/ . Hello World';
      expect(compile(input, { async: false })).to.eql(
        AST.convertV1ToV2([
          [
            'TextContainer',
            [],
            [
              [
                'p',
                [],
                [
                  [
                    'span',
                    [],
                    [
                      [
                        'a',
                        [['href', ['value', 'https://www.google.com/']]],
                        ['https://www.google.com/']
                      ],
                      ' . Hello World'
                    ]
                  ]
                ]
              ]
            ]
          ]
        ])
      );
    });

    it('should handle bold at the end of a paragraph', function() {
      const input = `
        This is **bold text.**

        This is a new paragraph.
      `;

      expect(compile(input, { async: false })).to.eql({
        id: 0,
        type: 'component',
        name: 'div',
        children: [
          {
            id: 2,
            type: 'component',
            name: 'TextContainer',
            children: [
              {
                id: 3,
                type: 'component',
                name: 'p',
                children: [
                  { id: 4, type: 'textnode', value: 'This is ' },
                  {
                    id: 5,
                    type: 'component',
                    name: 'strong',
                    children: [{ id: 6, type: 'textnode', value: 'bold text.' }]
                  }
                ]
              },
              {
                id: 7,
                type: 'component',
                name: 'p',
                children: [
                  { id: 8, type: 'textnode', value: 'This is a new paragraph.' }
                ]
              }
            ]
          }
        ]
      });
    });
  });
  it('should handle numbers and symbols with and without spaces', function() {
    const input = `
      Test 1 2Three 1 2 Three 123Four
    `;

    expect(compile(input, { async: false })).to.eql({
      id: 0,
      type: 'component',
      name: 'div',
      children: [
        {
          id: 2,
          type: 'component',
          name: 'TextContainer',
          children: [
            {
              id: 3,
              type: 'component',
              name: 'p',
              children: [
                {
                  id: 4,
                  type: 'textnode',
                  value: 'Test 1 2Three 1 2 Three 123Four'
                }
              ]
            }
          ]
        }
      ]
    });
  });

  it('should preprocess multiline equations', function() {
    const input = `
      [Equation display:true]
      \begin{aligned}
      (\overline{p + a})\star(\chi - p - a) &= \chi \star(\overline{p + a}) - (p + a)\star(\overline{p + a}) \\
      &= \chi\star\bar p + \chi\star\bar a - p\star\bar p - a\star\bar a - 2 p\star\bar a \\
      &= \bar p\star(\chi - p) + \bar a\star(\chi - a) - 2 p\star\bar a
      \end{aligned}
      [/Equation]
    `;

    expect(compile(input, { async: false })).to.eql({
      id: 0,
      type: 'component',
      name: 'div',
      children: [
        {
          id: 2,
          type: 'component',
          name: 'TextContainer',
          children: [
            {
              id: 3,
              type: 'component',
              name: 'equation',
              properties: {
                display: {
                  type: 'value',
                  value: true
                }
              },
              children: [
                {
                  id: 4,
                  type: 'textnode',
                  value:
                    '\begin{aligned}\n      (overline{p + a})star(chi - p - a) &= chi star(overline{p + a}) - (p + a)star(overline{p + a}) \\\n      &= chistar\bar p + chistar\bar a - pstar\bar p - astar\bar a - 2 pstar\bar a \\\n      &= \bar pstar(chi - p) + \bar astar(chi - a) - 2 pstar\bar a\n      end{aligned}'
                }
              ]
            }
          ]
        }
      ]
    });
  });
});
