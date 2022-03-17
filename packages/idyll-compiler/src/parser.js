const grammar = require('./grammar');
const nearley = require('nearley');

module.exports = function(input, tokenChunks, positions, options) {
  options = options || {};

  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  let tokenPosition = 0;

  const processToken = token => {
    p.feed(token);
    tokenPosition++;
    if (token !== 'EOF') {
      p.feed(' ');
    }
  };

  const processTokenChunk = tokenChunk => {
    tokenChunk.forEach(token => {
      if (typeof token === 'string') {
        processToken(token);
      } else {
        processTokenChunk(token);
      }
    });
  };

  tokenChunks.forEach(tokenChunk => {
    try {
      processTokenChunk(tokenChunk);
    } catch (err) {
      const position = positions[tokenPosition];
      const message =
        'Error parsing input at line ' +
        position[0] +
        ', column ' +
        position[1] +
        '\n\n' +
        input.split('\n')[position[0] - 1] +
        '\n' +
        Array(Math.max(0, position[1] - 2)).join(' ') +
        '^^^';

      const e = new Error(message);
      e.row = position[0];
      e.column = position[1];
      throw e;
    }
  });
  var results = p.results;

  if (results.length) {
    if (results.length > 1) {
      console.warn('Warning: this Idyll markup resulted in an ambiguous parse');
    }

    return results[0];
  }

  throw new Error('No parse results');
};
