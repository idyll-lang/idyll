
var Lexer = require('lex');

module.exports = function() {
  var lexer = new Lexer();
  var inComponent = false;
  var text;

  lexer.addRule(/^\s?#{1,6}/gm, function(lexeme) {
    if (!this.reject) {
      text = lexeme.trim();
    }
    return 'HEADER';
  });

  lexer.addRule(/(\n?[^\[\n\]])+/, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'WORDS';
  });

  lexer.addRule(/[ \t]+/, function(lexeme) {
  });

  lexer.addRule(/ *\n{2} */, function(lexeme) {
    this.reject = inComponent;

    if (!this.reject) {
      text = null;
    }
    return 'BREAK';
  });

  lexer.addRule(/\[/, function(lexeme) {
    inComponent = true;

    if (!this.reject) {
      text = null;
    }
    return 'OPEN_BRACKET';
  });

  lexer.addRule(/\]/, function(lexeme) {
    inComponent = false;
    if (!this.reject) {
      text = null;
    }
    return 'CLOSE_BRACKET';
  });


  lexer.addRule(/\//, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
    }
    return 'FORWARD_SLASH';
  });

  lexer.addRule(/[^0-9:\s\/\]"'`\.][^:\s\/\]"'`\.]*/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'COMPONENT_WORD';
  });

  lexer.addRule(/`[^`]*`/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'EXPRESSION';
  });

  lexer.addRule(/[0-9]+\.?[0-9]*/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'NUMBER';
  });

  lexer.addRule(/"[^"]*"/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'STRING';
  });

  lexer.addRule(/:/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
    }
    return 'PARAM_SEPARATOR';
  });

  lexer.addRule(/\s*$/, function(lexeme) {
    if (!this.reject) {
      text = null;
    }
    return 'EOF';
  });

  return function(str) {
    var vals = [];
    var tokens = [];
    text = null;

    lexer.input = str;

    var token = lexer.lex();
    while(token) {
      tokens.push(token);
      if (text !== null) {
        tokens.push('TOKEN_VALUE_START');
        tokens.push('"' + text.replace(/\"/g, '&quot;') + '"');
        tokens.push('TOKEN_VALUE_END');
      }
      token = lexer.lex();
    }
    return tokens.join(' ');
  }
}