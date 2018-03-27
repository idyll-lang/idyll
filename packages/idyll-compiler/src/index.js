
const parse = require('./parser');
const Lexer = require('./lexer');
const process = require('./processors');
const preProcessors = require('./processors/pre');
const { hoistVariables, flattenChildren, cleanResults, makeFullWidth, wrapText } = require('./processors/post');
const matter = require('gray-matter');


const cleanNewlines = (input) => {
  return input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

module.exports = function(input, options) {
  input = cleanNewlines(input);
  const { content, data } = matter(input.trim());
  options = Object.assign({}, { spellcheck: false, smartquotes: true }, options || {});
  const lex = Lexer();
  const lexResults = lex(content);
  const output = parse(content, lexResults.tokens.join(' '), lexResults.positions, options);

  const ret = process(output, options)
    .pipe(hoistVariables)
    .pipe(flattenChildren)
    .pipe(makeFullWidth)
    .pipe(wrapText)
    .pipe(cleanResults)
    .end();

  return ret;
}