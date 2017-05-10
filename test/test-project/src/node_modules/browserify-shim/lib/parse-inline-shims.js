'use strict';

function parseDepends(deps) {
  if (!deps) return undefined;
  // allow depends: [ '..' ] and depends: '..'
  deps = Array.isArray(deps) ? deps : [ deps ];

  return deps
    .reduce(function (acc, d) {
      var parts = d.split(':');
      if (!parts 
          || parts.length > 2 
          || parts.length < 1
          || !parts[0]) 
        throw new Error('Invalid depends specification: "' + d + '". Needs to have format: "nameORpath:export"');

      parts = parts.map(function (p) { 
        return typeof p === 'string' ? p.trim() : p 
      });
        
      // if parts[1] is not defined that means that we depend on module named in parts[0]
      // but we don't need it to be attached to the window under a certain name
      acc[parts[0]] = parts[1] || null;
      return acc;
    }, {});
}

/**
 * Parses inlined shims-config and returns a config in the same format that is used by external shims
 *
 * Example:
 *
 *  Given:  
 *    { jquery: '$',
 *      'non-cjs': 'noncjs',
 *      'non-cjs-dep': { exports: 'noncjsdep', depends: 'non-cjs:noncjs' },
 *      'just-dep': { exports: 'justdep', depends: [ 'non-cjs:noncjs', 'jquery:$' ] } 
 *    }
 *
 *  returns: 
 *    { jquery: { exports: '$', depends: undefined },
 *      'non-cjs': { exports: 'noncjs', depends: undefined },
 *      'non-cjs-dep': { exports: 'noncjsdep', depends: { 'non-cjs': 'noncjs' } },
 *      'just-dep': { exports: 'justdep', depends: { 'non-cjs': 'noncjs', jquery: '$' } } 
 *    }
 * 
 * @name parseInlineShims 
 * @function
 * @param {Object} config inlined shims config
 * @return {Object} parsed config
 */
var go = module.exports = function (config) {
  // all errors thrown are caught inside resolve-shims and passed back to browserify-shim
  return Object.keys(config)
    .reduce(function (acc, field) {
      var conf = config[field];
      
      // normalize two possible formats:
      //    "key": "export,
      //    "key": { "exports": "export" .. }
      if (typeof conf === 'string') conf = { exports: conf };

      var exps = conf.exports && conf.exports.length ? conf.exports.trim() : null;

      acc[field.trim()] = {
          exports: exps 
        , depends: parseDepends(conf.depends)
      }

      return acc;
    }, {});
}
