'use strict';

var transformify = require('transformify')
  , through = require('through2')
  , expose = require('./expose');

exports = module.exports = 

/**
 * browserify transform which exposes globals as modules that can be required.
 *
 * @name exposify
 * @function
 * @param {string} file file whose content is to be transformed
 * @param {Object=} opts (exposify config), defaults to exposify.config or $EXPOSIFY_CONFIG
 * @return {TransformStream} transform that replaces require statements found in the code with global assigments
 */
function exposify(file, opts) {
  opts = opts || {};
  opts.filePattern = opts.filePattern || exports.filePattern;
  opts.expose = opts.expose || exports.config;

  if (opts.filePattern && !opts.filePattern.test(file)) return through();

  if (typeof opts.expose !== 'object') {
   throw new Error('Please pass { expose: { ... } } to transform, set exposify.config or $EXPOSIFY_CONFIG so exposify knows what to expose');
  }

  // using transform options will pass non-option arguments as array on _
  if (Array.isArray(opts.expose._)) {
    delete opts.expose._
  }

  var tx = transformify(expose.bind(null, opts.expose));
  return tx(file);
};

/**
 * The config which is used by exposify to determine which require statemtents to replace and how.
 * You need to set this or provide it via the `EXPOSIFY_CONFIG` environment variable.
 *
 * ### Example
 *
 *  ```js
 *  var b = browserify();
 *
 *  // setting via transform argument
 *  b.transform('exposify', { expose: { jquery: '$', three: 'THREE' } });
 *  ```
 *
 *  ```js
 *  // setting from javascript
 *  exposify.config = { jquery: '$', three: 'THREE' };
 *  ```
 *
 *  ```sh
 *  # setting from command line
 *  EXPOSIFY_CONFIG='{ "jquery": "$", "three": "THREE" }' browserify -t exposify ...
 *  ```
 * 
 * @name exposify::config
 * 
 */
exports.config = (function () {
  if (process.env.EXPOSIFY_CONFIG) {
    try {
      return JSON.parse(process.env.EXPOSIFY_CONFIG);
    } catch (err) {
      console.error('Invalid exposify config!');
      console.error(err.stack);
    }
  }
})();


/**
 * Regex pattern of files whose content is exposified
 * 
 * @name exposify::filePattern
 */
exports.filePattern = /\.js$/;

/**
 * Exposes the expose function that operates on a string
 * 
 * @name exposify::expose
 */
exports.expose = expose;

