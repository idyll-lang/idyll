const grammar = require('./grammar');
const nearley = require('nearley');
const smartquotes = require('smartquotes');
const Spellcheck = require('spellchecker');
// Create a Parser object from our grammar.


/**
 * Clean results removes unnecessary
 * <p> tags inside of other blocks.
 */
const cleanResults = (node) => {
  if (typeof node === 'string') {
    node.split(/\s/).forEach((word) => {
      word = word.trim();
      if (Spellcheck.isMisspelled(word)) {
        const suggestions = Spellcheck.getCorrectionsForMisspelling(word);
        if (suggestions.length) {
          console.log(word + ': did you mean ' + Spellcheck.getCorrectionsForMisspelling(word)[0]);
        } else {
          console.log(word + ': no suggestions found');
        }
      }
    })
    return smartquotes(node);
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


module.exports = function(input, tokens, positions) {
  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  try {
    p.feed(tokens);
  } catch(err) {
    const cleaned = tokens.substring(0, err.offset).replace(/"[^"]*"/g, 'x');
    const index = cleaned.match(/ /g).length;
    const position = positions[index];
    const message = 'Error parsing input at line ' + position[0] + ', column ' + position[1] + '\n\n' + input.split('\n')[position[0] - 1] + '\n' + Array(position[1] - 2).join(' ') + '^^^';
    const e = new Error(message);
    e.row = position[0];
    e.column = position[1];
    throw e;
  }
  var results = p.results;

  if (results.length) {
    if (results.length > 1) {
      // console.log(JSON.stringify(results, null, 2));
      // console.log(str);
    }
    console.log('\n\nSpellcheck:');
    return results[0].map(cleanResults);
  }
  throw new Error('No parse results');
}
