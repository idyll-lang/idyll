const { readFileSync } = require('fs');
const { join, isAbsolute } = require('path');

const themes = require('idyll-themes');
const layouts = require('idyll-layouts');

const isPath = (str) => {
  return (str.indexOf('/') > -1 || str.indexOf('\\') > -1);
};

const cleanPath = (str) => {
  return str.replace(/;/g, '');
}

module.exports = function (options) {
  let { layout, theme, css } = options;
  layout = layout.trim();
  theme = theme.trim();
  css = css ? css.trim() : css;
  const pathPrefix = css && isAbsolute(css) ? '' : process.cwd();

  const layoutCSS = isPath(layout) ? readFileSync(join(pathPrefix, cleanPath(layout))) : layouts[layout].styles;
  const themeCSS = isPath(theme) ? readFileSync(join(pathPrefix, cleanPath(theme))) : themes[theme].styles;
  const customCSS = css ? readFileSync(join(pathPrefix, cleanPath(css))) : '';

  return [layoutCSS, themeCSS, customCSS].join('\n');
}
