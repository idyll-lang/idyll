import lexer from './lexer';
import parse from './parser';

import { converters } from 'idyll-ast';
const { convertV1ToV2 } = converters;

import parseFrontMatter from 'gray-matter';
import cleanNewlines from './util/clean-newlines';
import pipeline from './util/pipeline';

// AST transformer imports
import hoistVariables from './transformers/hoist-variables';
import flattenChildren from './transformers/flatten-children';
import makeFullWidth from './transformers/make-full-width';
import wrapText from './transformers/wrap-text';
import cleanResults from './transformers/clean-results';
import smartQuotes from './transformers/smart-quotes';
import autoLinkify from './transformers/auto-linkify';

const astTransformers = [
  hoistVariables,
  flattenChildren,
  makeFullWidth,
  wrapText,
  cleanResults,
  smartQuotes,
  autoLinkify
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
