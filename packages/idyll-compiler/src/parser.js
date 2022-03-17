const grammar = require('./grammar');
const nearley = require('nearley');

module.exports = function(input, tokenChunks, positions, options) {
  options = options || {};

  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  // console.log(tokens);

  const processToken = token => {
    // try {
    p.feed(token);
    if (token !== 'EOF') {
      p.feed(' ');
    }
    // } catch(err) {
    //   console.log(err);
    //   throw err;
    // }
    // console.log("tokenchunk", tokenChunk)
    // if (typeof tokenChunk[0] === 'string') {
    //   console.log('feeding ', tokenChunk.join(" "))
    //   try {
    //     p.feed(tokenChunk.join(" "));
    //     if (tokenChunk[0] !== "EOF") {
    //       p.feed(" ");
    //     }
    //   } catch(err) {
    //     console.log("error when feeding");
    //     console.log(err);
    //   }
    // } else {
    //   console.log("not feeding");
    // }
  };

  const processTokenChunk = tokenChunk => {
    tokenChunk.forEach(token => {
      if (typeof token === 'string') {
        processToken(token);
      } else {
        processTokenChunk(token);
      }
    });
    // console.log("tokenchunk", tokenChunk)
    // if (typeof tokenChunk[0] === 'string') {
    //   console.log('feeding ', tokenChunk.join(" "))
    //   try {
    //     p.feed(tokenChunk.join(" "));
    //     if (tokenChunk[0] !== "EOF") {
    //       p.feed(" ");
    //     }
    //   } catch(err) {
    //     console.log("error when feeding");
    //     console.log(err);
    //   }
    // } else {
    //   console.log("not feeding");
    // }
  };

  // p.feed(tokenChunks.flat(Number.POSITIVE_INFINITY).join(" "));
  // console.log('tokenChunks', tokenChunks.flat(Number.POSITIVE_INFINITY).join(" "));

  tokenChunks.forEach((tokenChunk, i) => {
    try {
      processTokenChunk(tokenChunk);
    } catch (err) {
      const index = i;
      const position = positions[index];
      console.log(i, tokenChunk[i]);
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
  // console.log(p);
  var results = p.results;

  if (results.length) {
    // console.log('Results length: ' + results.length);
    if (results.length > 1) {
      console.warn('This resulted in an ambiguous parse');
      console.log(tokenChunks);
      // console.log(p)
      throw new Error('This resulted in an ambiguous parse');
      // console.log(JSON.stringify(results, null, 2));
      // console.log(str);
    }
    // console.log(JSON.stringify(results[0]));

    return results[0];
  }

  throw new Error('No parse results');
};
