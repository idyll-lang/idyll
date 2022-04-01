const lexer = require('./lexer');
const parse = require('./parser');
const { convertV1ToV2 } = require('idyll-ast').converters;
const parseFrontMatter = require('gray-matter');

const cleanNewlines = require('./util/clean-newlines');
const pipeline = require('./util/pipeline');

const defaultPlugins = [
  require('./plugins/hoist-variables'),
  require('./plugins/flatten-children'),
  require('./plugins/make-full-width'),
  require('./plugins/wrap-text'),
  require('./plugins/clean-results'),
  require('./plugins/smart-quotes'),
  require('./plugins/auto-linkify')
];

module.exports = async function(input, context = {}) {
  // prepare compiler options
  context = Object.assign({ spellcheck: false, smartquotes: true }, context);

  // pre-process input text
  input = cleanNewlines(input).trim();

  // parse YAML front matter
  const { content, data } = parseFrontMatter(input);
  context.metadata = data || {};

  // perform lexing
  const lex = lexer({}, context.alias);
  let lexResults = '';
  try {
    lexResults = lex(content);
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    throw err;
  }

  // perform parsing to construct an Idyll AST
  let ast;
  try {
    ast = parse(content, lexResults.tokens, lexResults.positions);
    ast = convertV1ToV2(ast);
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    throw err;
  }

  // construct AST transformation pipeline
  const transform = pipeline(defaultPlugins, context.plugins || []);

  // apply AST transformations and return result
  return transform(ast, context);
};
