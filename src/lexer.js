
var Lexer = require('lex');

const formatToken = (text) => {
  const results = []
  results.push('TOKEN_VALUE_START');
  results.push('"' + text.replace(/\"/g, '&quot;') + '"');
  results.push('TOKEN_VALUE_END');
  return results;
}


module.exports = function() {
  var lexer = new Lexer();
  var inComponent = false;
  var column = 1;
  var row = 1;

  var updatePosition = function(lexeme) {
    var lines = lexeme.split('\n');
    row += lines.length - 1;
    if (lines.length > 1) {
      column = 0;
    }
    column += lines[lines.length - 1].length;
  }

  lexer.addRule(/^\s*(#{1,6})\s*([^\n]*)\n*/gm, function(lexeme, hashes, text) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['HEADER_' + hashes.length].concat(formatToken(text));
  });

  lexer.addRule(/^\s*\*\s*([^\n]*)\n?/gm, function(lexeme, text) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['UNORDERED_ITEM'].concat(formatToken(text.trim()));
  });

  lexer.addRule(/^\s*(\d+\.\s*([^\n]*)\n)*(\d+\.\s*([^\n]*)\n?)/gm, function(lexeme) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    const items = lexeme.split('\n');
    const matches = items.map((item) => /\d+\.\s*([^\n]*)/.exec(item)[1]);
    let output = ['ORDERED_LIST'];
    matches.forEach((item) => {
      output = output.concat(formatToken(item));
    });
    return output;
  });

  lexer.addRule(/`{3}[\s\S]*?`{3}/g, function(lexeme) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['FENCE'].concat(formatToken(lexeme));
  });

  lexer.addRule(/`/, function(lexeme) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BACKTICK'];
  });

  lexer.addRule(/\*/, function(lexeme) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STAR'];
  });

  lexer.addRule(/!\[([^\]]*)\]\(([^\)]*)\)/, function(lexeme, text, link) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['IMAGE'].concat(formatToken(text)).concat(formatToken(link));
  });

  lexer.addRule(/\[([^\]]*)\]\(([^\)]*)\)/, function(lexeme, text, link) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['LINK'].concat(formatToken(text)).concat(formatToken(link));
  });

  lexer.addRule(/^\s?\/\/[^\n]*$/gm, function(lexeme) {
    updatePosition(lexeme);
  });

  lexer.addRule(/(\n?[^`\*\[\n\]!])+/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });
  // Match on ! separately so we can greedily match the
  // image tag.
  lexer.addRule(/!/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });


  lexer.addRule(/ *\n{2,} */, function(lexeme) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BREAK'];
  });

  lexer.addRule(/[ \t\n]+/, function(lexeme) {
    updatePosition(lexeme);
  });


  lexer.addRule(/\[/, function(lexeme) {
    inComponent = true;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['OPEN_BRACKET'];
  });

  lexer.addRule(/\]/, function(lexeme) {
    inComponent = false;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['CLOSE_BRACKET'];
  });

  lexer.addRule(/\//, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['FORWARD_SLASH'];
  });

  lexer.addRule(/true|false/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BOOLEAN'].concat(formatToken(lexeme));
  });

  lexer.addRule(/[^+\-0-9:\s\/\]"'`\.][^:\s\/\]"'`\.]*/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['COMPONENT_WORD'].concat(formatToken(lexeme));
  });

  lexer.addRule(/`[^`]*`/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['EXPRESSION'].concat(formatToken(lexeme));
  });

  lexer.addRule(/[+\-]?[0-9]+\.?[0-9]*/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['NUMBER'].concat(formatToken(lexeme));
  });

  lexer.addRule(/"[^"]*"/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRING'].concat(formatToken(lexeme));
  });

  lexer.addRule(/:/, function(lexeme) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['PARAM_SEPARATOR'];
  });

  lexer.addRule(/\s*$/, function(lexeme) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['EOF'];
  });

  return function(str) {
    var vals = [];
    var output = [];
    var positions = [];

    lexer.input = str.trim();
    var token = lexer.lex();
    while(token) {
      output.push(token);
      positions.push([row, column]);
      token = lexer.lex();
    }
    return {
      tokens: output.join(' '),
      positions: positions
    };
  }
}