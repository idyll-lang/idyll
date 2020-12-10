var Lexer = require('lex');

const formatToken = text => {
  text = text || '';
  const results = [];
  results.push('TOKEN_VALUE_START');
  results.push(
    '"' +
      text
        .replace(/\"/g, '&quot;')
        .replace(/\\\[/, '[')
        .replace(/\\\]/, ']') +
      '"'
  );
  results.push('TOKEN_VALUE_END');
  return results;
};

const shouldBreak = text => {
  if (text.trim() === '' && (text.match(/\n/g) || []).length > 1) {
    return true;
  }
  return false;
};

let currentInput = null;

const lex = function(options, alias = {}) {
  let { row, column, outer, skipLists, inComponent, gotName } = Object.assign(
    {},
    {
      row: 1,
      column: 1,
      outer: true,
      skipLists: false,
      inComponent: false,
      gotName: false
    },
    options || {}
  );
  var lexer = new Lexer(function(chr) {
    let errorString = `
      Error lexing input, unexpected token: ${chr}

      Found near index ${this.index - 1}:

      ${currentInput.substring(
        Math.max(0, this.index - 10),
        Math.min(this.index + 10, currentInput.length - 1)
      )}
    `;
    throw new Error(errorString);
  });

  const recurse = (str, opts) => {
    return lex(Object.assign({ row, column, outer: false }, opts || {}), alias)(
      str
    ).tokens;
  };
  const findAliases = name => {
    const aliasNames = Object.keys(alias);
    return [
      name,
      ...aliasNames.filter(
        aliasName => alias[aliasName].toLowerCase() === name.toLowerCase()
      )
    ].join('|');
  };
  var updatePosition = function(lexeme) {
    var lines = lexeme.split('\n');
    row += lines.length - 1;
    if (lines.length > 1) {
      column = 0;
    }
    column += lines[lines.length - 1].length;
  };

  // Rules at the front are pre-processed,
  // e.g. equations, and code snippets
  // that shouldn't be formatted.
  const equationAliases = findAliases('equation');
  lexer.addRule(
    new RegExp(
      String.raw`\[\s*(${equationAliases})\s*([^\/\]]*)\s*\][\n\s\t]*(((?!(\[\s*\/(${equationAliases})\s*\])).\n?)*)[\n\s\t]*\[\s*\/\s*(${equationAliases})\s*\]`,
      'i'
    ),
    function(lexeme, tagName, props, innerText) {
      inComponent = false;
      if (this.reject) return;
      updatePosition(lexeme);
      return ['OPEN_BRACKET', 'COMPONENT_NAME']
        .concat(formatToken('equation'))
        .concat(recurse(props, { inComponent: true, gotName: true }))
        .concat(['CLOSE_BRACKET'])
        .concat(['WORDS'])
        .concat(formatToken(innerText.trim()))
        .concat(['OPEN_BRACKET', 'FORWARD_SLASH', 'COMPONENT_NAME'])
        .concat(formatToken('equation'))
        .concat(['CLOSE_BRACKET']);
    }
  );
  const codeAlias = findAliases('code');
  lexer.addRule(
    new RegExp(
      String.raw`\[\s*(${codeAlias})\s*([^\/\]]*)\s*\][\n\s\t]*(((?!(\[\s*\/(${codeAlias})\s*\])).\n?)*)[\n\s\t]*\[\s*\/\s*(${codeAlias})\s*\]`,
      'i'
    ),
    function(lexeme, tagName, props, innerText) {
      inComponent = false;
      if (this.reject) return;
      updatePosition(lexeme);
      return ['OPEN_BRACKET', 'COMPONENT_NAME']
        .concat(formatToken('code'))
        .concat(recurse(props, { inComponent: true, gotName: true }))
        .concat(['CLOSE_BRACKET'])
        .concat(['WORDS'])
        .concat(formatToken(innerText.trim()))
        .concat(['OPEN_BRACKET', 'FORWARD_SLASH', 'COMPONENT_NAME'])
        .concat(formatToken('code'))
        .concat(['CLOSE_BRACKET']);
    }
  );
  lexer.addRule(/`{4}(\S*)\n(((?!````)[\s\S])*[^\n])\n?\s*`{4}/g, function(
    lexeme,
    language,
    text
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['MULTILINE_CODE']
      .concat(formatToken(language))
      .concat(formatToken(text));
  });
  lexer.addRule(/`{3}(\S*)\n(((?!```)[\s\S])*[^\n])\n?\s*`{3}/g, function(
    lexeme,
    language,
    text
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['MULTILINE_CODE']
      .concat(formatToken(language))
      .concat(formatToken(text));
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

  lexer.addRule(/[\s\n]*(#{1,6})\s*([^\n\[]+)[\n\s]*/gm, function(
    lexeme,
    hashes,
    text
  ) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BREAK', 'HEADER_' + hashes.length]
      .concat(recurse(text, { skipLists: true }))
      .concat(['HEADER_END']);
  });

  lexer.addRule(/[\s\n]*>\s*([^\n\[]+)[\n\s]*/gm, function(lexeme, text) {
    if (this.reject) return;
    updatePosition(lexeme);
    return ['BREAK', 'QUOTE_START']
      .concat(recurse(text, { skipLists: true }))
      .concat(['QUOTE_END']);
  });

  lexer.addRule(/\*\*([^\s\n][^\*]*[^\s\n])\*\*(\s*)/g, function(
    lexeme,
    text,
    trailingSpace
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    var ret = ['STRONG']
      .concat(recurse(text, { skipLists: true }))
      .concat(['STRONG_END']);
    if (trailingSpace) {
      if (shouldBreak(trailingSpace)) {
        ret = ret.concat(['BREAK']);
      } else {
        ret = ret.concat(['WORDS']).concat(formatToken(trailingSpace));
      }
    }
    return ret;
  });
  lexer.addRule(/__([^\s\n][^_]*[^\s\n])__(\s*)/g, function(
    lexeme,
    text,
    trailingSpace
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    var ret = ['STRONG']
      .concat(recurse(text, { skipLists: true }))
      .concat(['STRONG_END']);
    if (trailingSpace) {
      if (shouldBreak(trailingSpace)) {
        ret = ret.concat(['BREAK']);
      } else {
        ret = ret.concat(['WORDS']).concat(formatToken(trailingSpace));
      }
    }
    return ret;
  });
  lexer.addRule(/\*([^\s\n\*][^\*]*[^\s\n\*])\*(\s*)/g, function(
    lexeme,
    text,
    trailingSpace
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    var ret = ['EM']
      .concat(recurse(text, { skipLists: true }))
      .concat(['EM_END']);
    if (trailingSpace) {
      if (shouldBreak(trailingSpace)) {
        ret = ret.concat(['BREAK']);
      } else {
        ret = ret.concat(['WORDS']).concat(formatToken(trailingSpace));
      }
    }
    return ret;
  });
  lexer.addRule(/_([^\s\n_][^_]*[^\s\n_])_(\s*)/g, function(
    lexeme,
    text,
    trailingSpace
  ) {
    this.reject = inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    var ret = ['EM']
      .concat(recurse(text, { skipLists: true }))
      .concat(['EM_END']);
    if (trailingSpace) {
      if (shouldBreak(trailingSpace)) {
        ret = ret.concat(['BREAK']);
      } else {
        ret = ret.concat(['WORDS']).concat(formatToken(trailingSpace));
      }
    }
    return ret;
  });

  lexer.addRule(/^\s*([\-\*]\s+([^\n]*)\n)*([\-\*]\s+([^\n]*)\n?)/gm, function(
    lexeme
  ) {
    this.reject = inComponent || skipLists;
    if (this.reject) return;
    updatePosition(lexeme);
    const items = lexeme.trim().split('\n');
    const matches = items.map(item => /[\-\*]\s*([^\n]*)/.exec(item)[1]);
    let output = ['BREAK', 'UNORDERED_LIST'];
    matches.forEach(item => {
      output = output.concat(['LIST_ITEM']).concat(recurse(item.trim() || ' '));
    });
    return output.concat(['LIST_END']);
  });

  lexer.addRule(/^\s*(\d+\.\s+([^\n]*)\n)*(\d+\.\s+([^\n]*)\n?)/gm, function(
    lexeme
  ) {
    this.reject = inComponent || skipLists;
    if (this.reject) return;
    updatePosition(lexeme);
    const items = lexeme.trim().split('\n');
    const matches = items.map(item => /\d+\.\s*([^\n]*)/.exec(item)[1]);
    let output = ['BREAK', 'ORDERED_LIST'];
    matches.forEach(item => {
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

  lexer.addRule(/(\n\s*\/\/[^\n]*|\/\/\s+[^\n]*)/, function(lexeme) {
    updatePosition(lexeme);
    if (lexeme.startsWith('\n')) {
      return ['BREAK'];
    }
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
  lexer.addRule(/[!\d\*_`] */, function(lexeme) {
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

  lexer.addRule(/\]([ ]*)/, function(lexeme, trailingSpace) {
    inComponent = false;
    gotName = false;
    if (this.reject) return;
    updatePosition(lexeme);
    var ret = ['CLOSE_BRACKET'];
    if (trailingSpace) {
      ret = ret.concat(['WORDS']).concat(formatToken(trailingSpace));
    }
    return ret;
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

  lexer.addRule(
    /[^+\-0-9:\s\/\]"'`\.]([^:\s\/\]"'`]*[^:\s\/\]"'`\.])*/,
    function(lexeme) {
      this.reject = !inComponent || gotName;
      if (this.reject) return;
      gotName = true;
      updatePosition(lexeme);
      return ['COMPONENT_NAME'].concat(formatToken(lexeme));
    }
  );
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

  lexer.addRule(/[+\-]?\.?[0-9]+\.?[0-9]*/, function(lexeme) {
    const multiplePeriods =
      (lexeme.match(new RegExp(/\./, 'g')) || []).length >= 2;
    this.reject = !inComponent || multiplePeriods;
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
  lexer.addRule(/'([^']*)'/, function(lexeme, str) {
    this.reject = !inComponent;
    if (this.reject) return;
    updatePosition(lexeme);
    return ['STRING'].concat(formatToken('"' + str + '"'));
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
    while (token) {
      output.push(token);
      positions.push([row, column]);
      token = lexer.lex();
    }
    return {
      tokens: output,
      positions: positions
    };
  };
};

module.exports = lex;
