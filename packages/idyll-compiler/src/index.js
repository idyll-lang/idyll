const lexer = require('./lexer');
const parse = require('./parser');
const { convertV1ToV2 } = require('idyll-ast').converters;
const parseFrontMatter = require('gray-matter');

const cleanNewlines = require('./util/clean-newlines');
const pipeline = require('./util/pipeline');

const astTransformers = [
  require('./transformers/hoist-variables'),
  require('./transformers/flatten-children'),
  require('./transformers/make-full-width'),
  require('./transformers/wrap-text'),
  require('./transformers/clean-results'),
  require('./transformers/smart-quotes'),
  require('./transformers/auto-linkify')
];

export default function(input, options, alias, callback) {
  // prepare compiler options
  options = Object.assign(
    {},
    { spellcheck: false, smartquotes: true },
    options || {}
  );

  // pre-process input text
  input = cleanNewlines(input).trim();

  // parse YAML front matter, discard for now
  const { content, data } = parseFrontMatter(input);

  // perform lexing
  const lex = lexer({}, alias);
  let lexResults = '';
  try {
    lexResults = lex(content);
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    return new Promise((resolve, reject) => reject(err));
  }

  // perform parsing to construct an Idyll AST
  let ast;
  try {
    ast = parse(content, lexResults.tokens, lexResults.positions, options);
    ast = convertV1ToV2(ast);
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    if (options.async) {
      return new Promise((resolve, reject) => reject(err));
    } else {
      throw err;
    }
  }

  // construct AST transformation pipeline
  const transform = pipeline(astTransformers, options.postProcessors || []);

  // apply AST transformations and return result
  return transform(ast, options);
}
