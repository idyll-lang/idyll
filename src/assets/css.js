const { readFileSync } = require('fs');
const { join, isAbsolute } = require('path');

const LAYOUTS_DIR = join(__dirname, '..', 'layouts');
const THEMES_DIR = join(__dirname, '..', 'themes');

module.exports = function (options) {
  const { layout, theme, css } = options;
  const pathPrefix = isAbsolute(css) ? '' : process.cwd();
  const layoutCSS = readFileSync(join(LAYOUTS_DIR, layout + '.css'));
  const themeCSS = readFileSync(join(THEMES_DIR, theme + '.css'));
  const customCSS = css ? readFileSync(join(pathPrefix, css)) : '';

  return [layoutCSS, themeCSS, customCSS].join('\n');
}
