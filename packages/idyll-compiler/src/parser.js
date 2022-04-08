import grammar from './grammar';
const nearley = require('nearley');

export default function(input, tokenChunks, positions) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  const processToken = token => {
    p.feed(token);
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

  tokenChunks.forEach((tokenChunk, index) => {
    try {
      processTokenChunk(tokenChunk);
    } catch (err) {
      const position = positions[index];
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
}
