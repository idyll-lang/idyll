
const parse = require('./parser');
const Lexer = require('./lexer');
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
  return output;
}
