const parse = require('./parser');
const Lexer = require('./lexer');
const Processor = require('./processors');
const { cleanNewlines } = require('./processors/pre');
const {
  hoistVariables,
  flattenChildren,
  cleanResults,
  makeFullWidth,
  wrapText,
  autoLinkify
} = require('./processors/post');
const { convertV1ToV2 } = require('idyll-ast').converters;
const matter = require('gray-matter');

module.exports = function(input, options, alias, callback) {
  input = Processor(input)
    .pipe(cleanNewlines)
    .end();
  const { content, data } = matter(input.trim());
  options = Object.assign(
    {},
    { spellcheck: false, smartquotes: true, async: true },
    options || {}
  );
  const lex = Lexer({}, alias);
  let lexResults = '',
    output = [];
  try {
    lexResults = lex(content);
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    return new Promise((resolve, reject) => reject(err));
  }
  try {
    output = parse(
      content,
      lexResults.tokens.join(' '),
      lexResults.positions,
      options
    );
  } catch (err) {
    console.warn(`\nError parsing Idyll markup:\n${err.message}`);
    if (options.async) {
      return new Promise((resolve, reject) => reject(err));
    } else {
      throw err;
    }
  }

  let astTransform = Processor(output, options)
    .pipe(hoistVariables)
    .pipe(flattenChildren)
    .pipe(makeFullWidth)
    .pipe(wrapText)
    .pipe(cleanResults)
    .pipe(autoLinkify)
    .end();

  astTransform = convertV1ToV2(astTransform);

  if (options.postProcessors) {
    // Turn them all into promises
    const promises = options.postProcessors.map(f => {
      return ast => {
        return new Promise((resolve, reject) => {
          if (f.length === 2) {
            f(ast, (err, value) => {
              if (err) {
                return reject(err);
              }
              resolve(value);
            });
          } else {
            resolve(f(ast));
          }
        });
      };
    });

    return promises.reduce((promise, f, i) => {
      return promise.then(val => {
        return f(val);
      });
    }, Promise.resolve(astTransform));
  } else {
    return options.async
      ? new Promise(resolve => resolve(astTransform))
      : astTransform;
  }
};
