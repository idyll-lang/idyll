
var Lexer = require('lex');

module.exports = function() {
  var lexer = new Lexer();
  var inComponent = false;
  var text;

  lexer.addRule(/^\s*#{1,6}\s*[^\n]*\n?/gm, function(lexeme) {
    const match = /\s*(#{1,6})\s*([^\n]*)/.exec(lexeme);
    if (!this.reject) {
      text = match[2].trim();
    }
    return 'HEADER_' + match[1].length;
  });

  lexer.addRule(/^\s*\*\s*[^\n]*\n?/gm, function(lexeme) {
    const match = /\s*\*\s*([^\n]*)/.exec(lexeme);
    if (!this.reject) {
      text = match[1].trim();
    }
    return 'UNORDERED_ITEM';
  });


  lexer.addRule(/^\s?\/\/[^\n]*$/gm, function(lexeme) {
  });

  lexer.addRule(/(\n?[^`\[\n\]])+/, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'WORDS';
  });

  lexer.addRule(/`{3}[\s\S]*?`{3}/g, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = lexeme;
    }
    return 'FENCE';
  });

  lexer.addRule(/ *\n{2} */, function(lexeme) {
    this.reject = inComponent;

    if (!this.reject) {
      text = null;
    }
    return 'BREAK';
  });

  lexer.addRule(/[ \t\n]+/, function(lexeme) {
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

  lexer.addRule(/true/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
    }
    return 'BOOLEAN TRUE';
  });

  lexer.addRule(/false/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
    }
    return 'BOOLEAN FALSE';
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