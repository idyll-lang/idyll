const { readFileSync } = require('fs');
const { join, isAbsolute, resolve } = require('path');

const LAYOUTS_DIR = join(__dirname, '..', 'layouts');
const THEMES_DIR = join(__dirname, '..', 'themes');

const isPath = (str) => {
  return (str.indexOf('/') > -1 || str.indexOf('\\') > -1);
};

module.exports = function (options) {
  const { layout, theme, css } = options;
  const pathPrefix = css && isAbsolute(css) ? '' : process.cwd();
  const layoutCSS = readFileSync(isPath(layout) ? resolve(layout) : join(LAYOUTS_DIR, layout + '.css'));
  const themeCSS = readFileSync(isPath(theme) ? resolve(theme) : join(THEMES_DIR, theme + '.css'));
  const customCSS = css ? readFileSync(join(pathPrefix, css)) : '';

  return [layoutCSS, themeCSS, customCSS].join('\n');
}
