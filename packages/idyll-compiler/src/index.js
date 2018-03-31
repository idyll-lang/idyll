
const parse = require('./parser');
const Lexer = require('./lexer');
const Processor = require('./processors');
const { cleanNewlines } = require('./processors/pre');
const { hoistVariables, flattenChildren, cleanResults, makeFullWidth, wrapText } = require('./processors/post');
const matter = require('gray-matter');

module.exports = function(input, options) {
  input = Processor(input).pipe(cleanNewlines).end();

  const { content, data } = matter(input.trim());

  options = Object.assign({}, { spellcheck: false, smartquotes: true }, options || {});
  const lex = Lexer();
  let lexResults = '', output = [];
  try {
    lexResults = lex(content);
  } catch(err) {
    console.warn('Error parsing Idyll markup:\n');
    console.error(err.message);
  }
  try {
    output = parse(content, lexResults.tokens.join(' '), lexResults.positions, options);
  } catch(err) {
    console.warn('\n\n\nError parsing Idyll markup:\n');
    console.error(err.message);
  }

  const ret = Processor(output, options)
    .pipe(hoistVariables)
    .pipe(flattenChildren)
    .pipe(makeFullWidth)
    .pipe(wrapText)
    .pipe(cleanResults)
    .end();

  return ret;
}