
var Lexer = require('lex');

const formatToken = (text) => {
  text = text || '';
  const results = []
  results.push('TOKEN_VALUE_START');
  results.push('"' + text.replace(/\"/g, '&quot;').replace(/\\\[/, '[').replace(/\\\]/, ']') + '"');
  results.push('TOKEN_VALUE_END');
  return results;
}

let currentInput = null;

const lex = function(options) {
  let { row, column, outer, skipLists } = Object.assign({}, {
    row: 1,
    column: 1,
    outer: true,
    skipLists: false
  }, options || {});
  var lexer = new Lexer(function (chr) {
    let errorString = `
      Error lexing input, unexpected token: ${chr}

      Found near index ${this.index - 1}:

      ${currentInput.substring(Math.max(0, this.index - 10), Math.min(this.index + 10, currentInput.length - 1))}
    `
    throw new Error(errorString);
  });
  var inComponent = false;
  var gotName = false;

  const recurse = (str, opts) => {
    return lex(Object.assign({ row, column, outer: false }, opts || {}))(str).tokens;
  };

  var updatePosition = function(lexeme) {
    var lines = lexeme.split('\n');
    row += lines.length - 1;
    if (lines.length > 1) {
      column = 0;
    }
    column += lines[lines.length - 1].length;
  }

  lexer.addRule(/`{4}(\S*)\n(((?!````)[\s\S])+)`{4}/g, function(lexeme, language, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['MULTILINE_CODE'].concat(formatToken(language)).concat(formatToken(text.trim()));
  });
  lexer.addRule(/`{3}(\S*)\n(((?!```)[\s\S])+)`{3}/g, function(lexeme, language, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['MULTILINE_CODE'].concat(formatToken(language)).concat(formatToken(text.trim()));
  });
  lexer.addRule(/```(((?!```)[^\n])+)```/, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['INLINE_CODE'].concat(formatToken(text.trim()));
  });
  lexer.addRule(/``(((?!``)[^\n])+)``/, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['INLINE_CODE'].concat(formatToken(text.trim()));
  });
  lexer.addRule(/`([^\n\`]+)`/, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['INLINE_CODE'].concat(formatToken(text.trim()));
  });

  lexer.addRule(/[\s\n]*(#{1,6})\s*([^\n\[]+)[\n\s]*/gm, function(lexeme, hashes, text) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BREAK', 'HEADER_' + hashes.length].concat(recurse(text, { skipLists: true })).concat(['HEADER_END']);
  });

  lexer.addRule(/\*([^\s\n\*][^\*]*[^\s\n\*])\*/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['EM'].concat(formatToken(text));
  });
  lexer.addRule(/_([^\s\n_][^_]*[^\s\n_])_/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['EM'].concat(formatToken(text));
  });
  lexer.addRule(/\*\*([^\s\n\*][^\*]*[^\s\n\*])\*\*/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRONG'].concat(formatToken(text));
  });
  lexer.addRule(/\*\*\*([^\s\n\*][^\*]*[^\s\n\*])\*\*\*/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRONGEM'].concat(formatToken(text));
  });
  lexer.addRule(/__([^\s\n_][^_]*[^\s\n_])__/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRONG'].concat(formatToken(text));
  });
  lexer.addRule(/___([^\s\n_][^_]*[^\s\n_])___/g, function(lexeme, text) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRONGEM'].concat(formatToken(text));
  });

  lexer.addRule(/^\s*([\-\*]\s*([^\n]*)\n)*([\-\*]\s*([^\n]*)\n?)/gm, function(lexeme) {
    this.reject = inComponent || skipLists;
    if (this.reject) return;
    updatePosition(lexeme);
    const items = lexeme.trim().split('\n');
    const matches = items.map((item) => /[\-\*]\s*([^\n]*)/.exec(item)[1]);
    let output = ['BREAK', 'UNORDERED_LIST'];
    matches.forEach((item) => {
      output = output.concat(['LIST_ITEM']).concat(recurse(item));
    });
    return output.concat(['LIST_END']);
  });

  lexer.addRule(/^\s*(\d+\.\s*([^\n]*)\n)*(\d+\.\s*([^\n]*)\n?)/gm, function(lexeme) {
    this.reject = inComponent || skipLists;
    if (this.reject) return;
    updatePosition(lexeme);
    const items = lexeme.trim().split('\n');
    const matches = items.map((item) => /\d+\.\s*([^\n]*)/.exec(item)[1]);
    let output = ['BREAK', 'ORDERED_LIST'];
    matches.forEach((item) => {
      output = output.concat(['LIST_ITEM']).concat(recurse(item));
    });
    return output.concat(['LIST_END']);
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

  lexer.addRule(/\s?\/\/[^\n]*/gm, function(lexeme) {
    updatePosition(lexeme);
  });

  lexer.addRule(/\/(\n?[^`\*\[\/\n\]!\\\d_])*/gm, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });

  lexer.addRule(/(\n?[^`\*\[\/\n\]!\\\d_])+/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });
  // Match on separately so we can greedily match the
  // other tags.
  lexer.addRule(/[!\d\*_`]/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });
  lexer.addRule(/\\[\[\]]?/, function(lexeme) {
    this.reject = inComponent || lexeme.trim() === '';
    if (this.reject) return;
    updatePosition(lexeme);
    return ['WORDS'].concat(formatToken(lexeme));
  });

  lexer.addRule(/\s*\n{2,}\s*/, function(lexeme) {
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
    gotName = false;
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

  lexer.addRule(/[^+\-0-9:\s\/\]"'`\.]([^:\s\/\]"'`]*[^:\s\/\]"'`\.])*/, function(lexeme) {
    this.reject = !inComponent || gotName;
    if (this.reject) return;
    gotName = true;
    updatePosition(lexeme);
    return ['COMPONENT_NAME'].concat(formatToken(lexeme));
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
    this.reject = !outer;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['EOF'];
  });

  return function(str) {
    currentInput = str;
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
      tokens: output,
      positions: positions
    };
  }
}

module.exports = lex;
