
const parse = require('./parser');
const Lexer = require('./lexer');
const Processor = require('./processors');
const { cleanNewlines } = require('./processors/pre');
const { hoistVariables, flattenChildren, cleanResults, makeFullWidth, wrapText } = require('./processors/post');
const matter = require('gray-matter');

module.exports = function(input, options, callback) {
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
    .pipe(cleanResults)
    .end();

  if (options.postProcessors) {

    // Turn them all into promises
    const promises = options.postProcessors.map((f) => {
      return (ast) => {
        return new Promise((resolve, reject) => {
          if (f.length === 2) {
            f(ast, (err, value) => {
              if (err) {
                return reject(err);
              }
              resolve(value);
            })
          } else {
            resolve(f(ast));
          }
        });
      }
    })

    const promise = promises.reduce((promise, f, i) => {
      return promise.then((val) => {
        return f(val);
      });
    }, Promise.resolve(astTransform));

    promise.then(v => {
      callback(null, v);
    }).catch(e => {
      callback(e);
    });
  } else if (callback) {
    callback(null, astTransform);
  } else {
    return astTransform;
  }
}