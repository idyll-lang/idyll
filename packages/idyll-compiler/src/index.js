import lexer from './lexer';
import parse from './parser';

import { convertV1ToV2 } from 'idyll-ast';

import parseFrontMatter from 'gray-matter';
import cleanNewlines from './util/clean-newlines';
import pipeline from './util/pipeline';

// AST transformer imports
import hoistVariables from './plugins/hoist-variables';
import flattenChildren from './plugins/flatten-children';
import makeFullWidth from './plugins/make-full-width';
import wrapText from './plugins/wrap-text';
import cleanResults from './plugins/clean-results';
import smartQuotes from './plugins/smart-quotes';
import autoLinkify from './plugins/auto-linkify';

const defaultPlugins = [
  hoistVariables,
  flattenChildren,
  makeFullWidth,
  wrapText,
  cleanResults,
  smartQuotes,
  autoLinkify
];

export default async function(input, context = {}) {
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
}
