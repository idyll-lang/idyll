
var Lexer = require('lex');


module.exports = function() {
  var lexer = new Lexer();
  var inComponent = false;
  var column = 1;
  var row = 1;
  var text;

  var updatePosition = function(lexeme) {
    var lines = lexeme.split('\n');
    row += lines.length - 1;
    if (lines.length > 1) {
      column = 0;
    }
    column += lines[lines.length - 1].length;
  }

  lexer.addRule(/^\s*#{1,6}\s*[^\n]*\n*/gm, function(lexeme) {
    const match = /\s*(#{1,6})\s*([^\n]*)/.exec(lexeme);
    if (!this.reject) {
      text = match[2].trim();
      updatePosition(lexeme);
    }
    return 'HEADER_' + match[1].length;
  });

  lexer.addRule(/^\s*\*\s*[^\n]*\n?/gm, function(lexeme) {
    const match = /\s*\*\s*([^\n]*)/.exec(lexeme);
    if (!this.reject) {
      text = match[1].trim();
      updatePosition(lexeme);
    }
    return 'UNORDERED_ITEM';
  });

  lexer.addRule(/^\s*\d+\.\s*[^\n]*\n?/gm, function(lexeme) {
    const match = /\s*\d+\.\s*([^\n]*)/.exec(lexeme);
    if (!this.reject) {
      text = match[1].trim();
      updatePosition(lexeme);
    }
    return 'ORDERED_ITEM';
  })

  lexer.addRule(/`{3}[\s\S]*?`{3}/g, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'FENCE';
  });

  lexer.addRule(/`/, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'BACKTICK';
  });

  lexer.addRule(/\*/, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'STAR';
  });

  lexer.addRule(/^\s?\/\/[^\n]*$/gm, function(lexeme) {
    updatePosition(lexeme);
  });

  lexer.addRule(/(\n?[^`\*\[\n\]])+/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'WORDS';
  });

  lexer.addRule(/ *\n{2,} */, function(lexeme) {
    this.reject = inComponent;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'BREAK';
  });

  lexer.addRule(/[ \t\n]+/, function(lexeme) {
    updatePosition(lexeme);
  });


  lexer.addRule(/\[/, function(lexeme) {
    inComponent = true;

    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'OPEN_BRACKET';
  });

  lexer.addRule(/\]/, function(lexeme) {
    inComponent = false;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'CLOSE_BRACKET';
  });


  lexer.addRule(/\//, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'FORWARD_SLASH';
  });

  // lexer.addRule(/true/, function(lexeme) {
  //   this.reject = !inComponent;
  //   if (!this.reject) {
  //     text = null;
  //     updatePosition(lexeme);
  //   }
  //   return 'BOOLEAN TRUE';
  // });

  // lexer.addRule(/false/, function(lexeme) {
  //   this.reject = !inComponent;
  //   if (!this.reject) {
  //     text = null;
  //     updatePosition(lexeme);
  //   }
  //   return 'BOOLEAN FALSE';
  // });

  lexer.addRule(/true|false/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'BOOLEAN';
  });

  lexer.addRule(/[^+\-0-9:\s\/\]"'`\.][^:\s\/\]"'`\.]*/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'COMPONENT_WORD';
  });

  lexer.addRule(/`[^`]*`/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'EXPRESSION';
  });

  lexer.addRule(/[+\-]?[0-9]+\.?[0-9]*/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'NUMBER';
  });

  lexer.addRule(/"[^"]*"/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = lexeme;
      updatePosition(lexeme);
    }
    return 'STRING';
  });

  lexer.addRule(/:/, function(lexeme) {
    this.reject = !inComponent;
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'PARAM_SEPARATOR';
  });

  lexer.addRule(/\s*$/, function(lexeme) {
    if (!this.reject) {
      text = null;
      updatePosition(lexeme);
    }
    return 'EOF';
  });

  return function(str) {
    var vals = [];
    var tokens = [];
    var positions = [];
    text = null;

    lexer.input = str.trim();

    var token = lexer.lex();
    while(token) {
      tokens.push(token);
      positions.push([row, column]);
      if (text !== null) {
        tokens.push('TOKEN_VALUE_START');
        positions.push([row, column]);
        tokens.push('"' + text.replace(/\"/g, '&quot;') + '"');
        positions.push([row, column]);
        tokens.push('TOKEN_VALUE_END');
        positions.push([row, column]);
      }
      token = lexer.lex();
    }
    return {
      tokens: tokens.join(' '),
      positions: positions
    };
  }
}