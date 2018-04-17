const p = require('path');
const fs = require('fs');

const htmlTags = require('html-tags');
const slash = require('slash');

const errors = require('../errors');

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

    prioritizedDirs.forEach(dirs => {
      dirs.forEach(dir => {
        var componentFiles = fs.readdirSync(dir);
        componentFiles.forEach(name => {
          var path = p.join(dir, name);
          componentsMap.set(name.toLowerCase(), path);
        });
      });
    });
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
    var lowerName = name.toLowerCase();
    if (this.inputConfig.components[name]) {
      return slash(p.join(this.paths.INPUT_DIR, this.inputConfig.components[name]));
    }
    var resolved = this.componentsMap.get(lowerName + '.js');
    if (resolved) {
      return slash(resolved);
    }
    try {
      // npm modules are required via relative paths to support working with a locally linked idyll
      return slash(resolve.sync(name, {basedir: INPUT_DIR}));
    } catch (err) {
      if (htmlTags.indexOf(name) === -1) {
        if (['fullwidth', 'textcontainer'].indexOf(node[0].toLowerCase()) > -1) {
          throw new errors.OutOfDateError(name);
        }
        throw new errors.InvalidComponentError(name);
      }
      // At this point, it is a valid HTML tag.
      return name;
    }
  }

  getDirectories() {
    return [...this.paths.COMPONENT_DIRS, ...this.paths.DEFAULT_COMPONENT_DIRS];
  }
}

module.exports = ComponentResolver
