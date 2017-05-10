'use strict';

var util         =  require('util')
  , resolve      =  require('resolve')
  , exposify     =  require('exposify')
  , format       =  require('util').format
  , path         =  require('path')
  , through      =  require('through')
  , resolveShims =  require('./lib/resolve-shims')
  , rename       =  require('rename-function-calls')
  , debug        =  require('./lib/debug')

var shimRequire = '__browserify_shim_require__';

function requireDependencies(depends, packageRoot, browserAliases, dependencies) {
  if (!depends) return '';

  function customResolve (k) { 
    // resolve aliases to full paths to avoid conflicts when require is injected into a file
    // inside another package, i.e. the it's shim was defined in a package.json one level higher
    // aliases don't get resolved by browserify in that case, since it only looks in the package.json next to it
    var browserAlias = browserAliases && browserAliases[k]
      , dependency = dependencies && dependencies[k]
      , alias;
    
    try {
      // prefer browser aliases defined explicitly
      alias =  browserAlias 
        ? path.resolve(packageRoot, browserAlias) 

        // but also consider dependencies installed in the package in which shims were defined
        : dependency 
          ? resolve.sync(k, { basedir: packageRoot }) 

          // lets hope for the best that browserify will be able to resolve this, cause we can't
          : k;
    } catch (err) {
      // resolve.sync may fail, in which case we give up and hope browserify can figure it out
      alias = k;
    }

    return { alias: alias, exports: depends[k] || null }; 
  }

  function noResolve(k) { 
    return { alias: k, exports: depends[k] || null };
  }

  return Object.keys(depends)

    // if the package was looked up from the parent of its enclosing package we need to pre-resolve the depends
    .map(customResolve)
    .reduce(
      function (acc, dep) {
        var alias = dep.alias.replace(/\\/g, "\\\\");
        return dep.exports 
          // Example: jQuery = global.jQuery = require("jquery");
          // the global dangling variable is needed cause some libs reference it as such and it breaks outside of the browser,
          // i.e.: (function ($) { ... })( jQuery )
          // This little extra makes it work everywhere and since it's on top, it will be shadowed by any other definitions 
          // so it doesn't conflict with anything.
          ? acc + dep.exports + ' = global.' + dep.exports + ' = require("' + alias + '");\n'
          : acc + 'require("' + alias + '");\n';
      }
    , '\n; '
  );
}

function bindWindowWithExports(s, dependencies) {
  // purposely make module, exports, require and define be 'undefined',
  // but pass a function that allows exporting our dependency from the window or the context
  
  // This results in code similarly to this example which shims ember which depends on jquery:

  /**
   * -- browserify wrapper
   * function(require,module,exports){ 
   *
   *    -- our deps (which still have access to require)
   *    jquery = global.jquery = require("/full/path/to/jquery.js");
   *
   *    -- assigning shimmed require to actual require
   *    -- this shouldn't matter, but would fix cases where libraries reach __browserify_shim_require__(x) as long 
   *    -- as x was included in the bundle
   *
   *    __browserify_shim_require__=require;
   *
   *    -- also it won't hurt anything
   *
   *    -- browserify-shim wrapper
   *    (function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) { 
   *       -- inside this function neither module, exports, require, or define are defined
   *
   *       -- browserify_shim__define__module__export__ allows exporting (since module and exports aren't available)
   *       
   *       [..] -- code that needs shimming
   *
   *       -- exporting whatever ember attached to the window
   *       ; browserify_shim__define__module__export__(typeof ember != "undefined" ? ember : window.ember); 
   *
   *    }).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });
   *    -- browserify-shim wrapper closed
   *  }
   *  -- browserify wrapper closed
   */

  // Shadowing require is necessary to fix code that tries to do common-js, but ends up requiring deps that cannot be resolved
  // In the case below we want the below condition to be false at run time.
  /**
   * if (!jQuery && typeof require === 'function') {
   *   jQuery = require('jquery');
   * }
   */

   // Additionally `require('jquery')` needs to be refactored to prevent browserify from looking for 'jquery' at bundle time.
   // The rewriting step happens inside the main @see shim function.
   // Thus it gets rewritten via rename-function-calls:
  /**
   * if (!jQuery && typeof require === 'function') {
   *   jQuery = __browserify_shim_removed_require__('jquery');
   * }
   */
  // The fact that __browserify_shim_removed_require__ is not defined doesn't matter since we never enter that block.

  return dependencies
      + '; var ' + shimRequire + '=require;' 
      + '(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {\n'
      + s 
      + '\n}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });\n';
}

function bindWindowWithoutExports(s, dependencies) {
  // if a module doesn't need anything to be exported, it is likely, that it exports itself properly
  // therefore it is not a good idea to override the module here, however we need to still disable require
  // all else is similar to @see bindWindowWithExports
  return dependencies
      + '; var ' + shimRequire + '=require;' 
      + '(function browserifyShim(module, define, require) {\n'
      + s 
      + '\n}).call(global, module, undefined, undefined);\n';
}

function moduleExport(exp) {
  return format('\n; browserify_shim__define__module__export__(typeof %s != "undefined" ? %s : window.%s);\n', exp, exp, exp);
}

function wrap(content, config, packageRoot, browserAliases) {
  var exported = config.exports
      ? content + moduleExport(config.exports)
      : content
  , dependencies = requireDependencies(config.depends, packageRoot, browserAliases)
  , boundWindow = config.exports
      ? bindWindowWithExports(exported, dependencies)
      : bindWindowWithoutExports(exported, dependencies);

  return boundWindow;
}

module.exports = function shim(file) {
  var content = '';
  var stream = through(write, end);
  return stream;

  function write(buf) { content += buf; }
  function end() {
    var messages = [];
    resolveShims(file, messages, function (err, info) {
      if (err) {
        stream.emit('error', err);
        return stream.queue(null);
      }

      debug('');
      debug.inspect({ file: file, info: info, messages: messages });

      var eg = info.exposeGlobals;
      if(eg && Object.keys(eg)) {
        content = exposify.expose(eg, content);
      }

      if (info.shim) { 
        
        // at this point we consider all remaining (not exposified) require statements to be invalid (why else are we shimming this)
        content = rename('require', shimRequire, content);

        var transformed = wrap(content, info.shim, info.packageDir, info.browser)
        stream.queue(transformed);
      } else { 
        stream.queue(content);
      }

      stream.queue(null);
    });
  }
}
