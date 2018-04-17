const p = require('path');
const fs = require('fs');

const htmlTags = require('html-tags');
const slash = require('slash');
const { paramCase, pascalCase } = require('change-case');

const errors = require('../errors');
const debug = require('debug')('idyll-cli')

class ComponentResolver {
  constructor(options, paths) {
    this.paths = paths
    this.inputConfig = options.inputConfig;

    // Set in `_loadPaths`.
    this.componentsMap = null;

    this._loadPaths();
  }

  /**
   * Component resolution works by first constructing of Map of name -> path pairs that's later consulted in
   * `resolve`.
   *
   * The Map is constructed by iterating first over the following component lists in order:
   *  1) The default components.
   *  2) The custom components.
   *  3) The user-defined aliased components.
   *
   * Each new components list potentially overwrites previously-resolved components, according to the
   * above order of precedence.
   */
  _loadPaths() {
    var componentsMap = new Map();
    var prioritizedDirs = [this.paths.DEFAULT_COMPONENT_DIRS, this.paths.COMPONENT_DIRS];
    debug(`Component directories (prioritized in ascending order): ${prioritizedDirs}`)

    prioritizedDirs.forEach(dirs => {
      dirs.forEach(dir => {
        try {
          fs.statSync(dir);
        } catch (err) {
          // If the custom component directory doesn't exist, silently proceed to the next directory.
          return;
        }
        debug(`Searching directory ${dir} for components...`);
        var componentFiles = fs.readdirSync(dir);
        componentFiles.forEach(name => {
          var path = p.join(dir, name);
          componentsMap.set(name.toLowerCase(), path);
        });
      });
    });
    if (debug.enabled) {
      debug('Resolved components:');
      debug([...componentsMap].reduce((s, p) => {
        return s += `  ${p[0]} => ${p[1]}\n`;
      }, ''));
    }
    this.componentsMap = componentsMap;
  }

  /**
   * A name is mapped to a component in the following order of precedence:
   *
   * 1) If a component alias exists, then use the aliased path.
   * 2) If a custom component exists, then use that component's path.
   * 3) If a default component exists, use its path.
   * 4) If no component has been found, attempt to resolve a component installed through NPM.
   * 5) If the NPM resolution failed, check if this is a valid HTML tag, and use the tag name.
   * 6) Else, return nothing (this is a failure).
   */
  resolve(name) {
    const self = this
    const candidates = [pascalCase(name), paramCase(name), name.toLowerCase()];
    debug(`Searching for component: ${name} with candidates: ${candidates}`);

    var resolved = null

    candidates.forEach(name => {
      if (resolved) return
      if (self.inputConfig.components[name]) {
        resolved = slash(p.join(self.paths.INPUT_DIR, self.inputConfig.components[name]));
      }
      resolved = self.componentsMap.get(name + '.js');
      if (resolved) {
        resolved = slash(resolved);
      }
      try {
        // npm modules are required via relative paths to support working with a locally linked idyll
        resolved = slash(resolve.sync(name, {basedir: INPUT_DIR}));
      } catch (err) {
        // Import errors are silently discarded
        return
      }
    })

    if (!resolved) {
      if (htmlTags.indexOf(name) === -1) {
        if (['fullwidth', 'textcontainer'].indexOf(name) > -1) {
          throw new errors.OutOfDateError(name);
        }
      }
      // At this point, it is a valid HTML tag.
      debug('At this point for name: ' + name)
      resolved = name;
    }

    if (!resolved) throw new errors.InvalidComponentError(name);

    debug(`Resolved component ${name} to ${resolved}`)
    return resolved;
  }

  getDirectories() {
    return [...this.paths.COMPONENT_DIRS, ...this.paths.DEFAULT_COMPONENT_DIRS];
  }
}

module.exports.ComponentResolver = ComponentResolver
