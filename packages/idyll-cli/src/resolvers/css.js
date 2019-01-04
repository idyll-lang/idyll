const { readFileSync, existsSync } = require('fs');
const { join, isAbsolute } = require('path');

const themes = require('idyll-themes');
const layouts = require('idyll-layouts');

const cleanPath = str => str.replace(/;/g, '');
const cleanKey = key => (key ? key.trim() : key);

const resourceLoader = root => resource => {
  let { path, defaultContent } = resource;
  if (!path) {
    return defaultContent;
  }
  const resourceFilePath = isAbsolute(path)
    ? cleanPath(path)
    : join(root, cleanPath(path));
  if (!existsSync(resourceFilePath)) {
    return defaultContent;
  }
  return readFileSync(resourceFilePath);
};

const createResource = (key, defaultContent) => ({
  path: key,
  defaultContent
});

class CSSResolver {
  constructor(options) {
    const { layout, theme, css } = options;
    this.resourceKeys = [layout, theme, css].map(cleanKey);
    this.defaultSources = [layouts, themes, null];
    this.resourceRoot = css && isAbsolute(css) ? '' : process.cwd();
  }

  getDefaults() {
    return this.defaultSources.map((source, i) => {
      if (!source || !this.resourceKeys[i] || !source[this.resourceKeys[i]]) {
        return '';
      }
      return source[this.resourceKeys[i]].styles || '';
    });
  }

  getResources() {
    const defaults = this.getDefaults();
    return this.resourceKeys.map((key, i) => createResource(key, defaults[i]));
  }

  resolve() {
    const loadFromResource = resourceLoader(this.resourceRoot);
    return this.getResources()
      .map(loadFromResource)
      .join('\n');
  }

  getDirectories() {
    return [];
  }
}

module.exports.CSSResolver = CSSResolver;
