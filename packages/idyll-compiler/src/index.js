
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
  const lexResults = lex(content);
  const output = parse(content, lexResults.tokens.join(' '), lexResults.positions, options);

  let astTransform = Processor(output, options)
    .pipe(hoistVariables)
    .pipe(flattenChildren)
    .pipe(makeFullWidth)
    .pipe(wrapText)
    .pipe(cleanResults);

  if (options.postProcessors) {
    options.postProcessors.forEach(astTransform.pipe);
  }

  return astTransform.end();
}