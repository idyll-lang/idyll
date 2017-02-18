const grammar = require('./grammar');
const nearley = require("nearley");

// Create a Parser object from our grammar.


/**
 * Clean results removes unnecessary 
 * <p> tags inside of other blocks.
 */
const cleanResults = (node) => {
  if (typeof node === 'string') {
    return node;
  }

  if (node[0] !== 'p'
    && node[2].length === 1
    && node[2][0][0] === 'p'
    && node[2][0][2]
    && node[2][0][2].length === 1
    && typeof node[2][0][2][0] === 'string') {
      return [node[0], node[1], node[2][0][2]];
  }

  return [node[0], node[1], node[2].map(cleanResults)];
};


module.exports = function(str) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  p.feed(str);
  var results = p.results;

  if (results.length) {
    if (results.length > 1) {
      // console.log(JSON.stringify(results, null, 2));
      // console.log(str);
    }
    return results[0].map(cleanResults);
  }
  throw new Error('No parse results');
}
