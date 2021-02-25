const { dirname, isAbsolute, join, parse, resolve, relative } = require('path');

const debug = require('debug')('idyll:cli');

function getBaseDir(path) {
  return path && isAbsolute(path) ? dirname(path) : process.cwd();
}

function resolveWithBase(base) {
  return path => {
    if (!path || isAbsolute(path)) {
      return path;
    }
    return join(base, path);
  };
}

module.exports = function(opts) {
  const projectBaseDir = getBaseDir(opts.inputFile);
  const resolveWithProjBase = resolveWithBase(projectBaseDir);

  const getComponentDirs = paths => {
    if (paths instanceof Array) return paths.map(p => resolveWithProjBase(p));
    return [resolveWithProjBase(paths)];
  };

  const resolveWithOutputBase = resolveWithBase(getBaseDir(opts.output));
  const OUTPUT_DIR = resolveWithOutputBase(opts.output);
  const STATIC_OUTPUT_DIR = join(
    OUTPUT_DIR,
    opts.staticOutputDir || 'static'
  ).replace(/\/$/, '');
  const TMP_DIR = resolveWithProjBase(opts.temp);

  return {
    APP_PATH: resolve(__dirname, '..'),
    CSS_INPUT_FILE: resolveWithProjBase(opts.css),
    DATA_DIR: resolveWithProjBase(opts.datasets),
    STATIC_DIR: resolveWithProjBase(opts.static),
    COMPONENT_DIRS: getComponentDirs(opts.components),
    DEFAULT_COMPONENT_DIRS: getComponentDirs(opts.defaultComponents),
    HTML_TEMPLATE_FILE: resolveWithProjBase(opts.template),
    IDYLL_INPUT_FILE: resolveWithProjBase(opts.inputFile),
    INPUT_DIR: projectBaseDir,
    PACKAGE_FILE: resolveWithProjBase('package.json'),

    OUTPUT_DIR,
    HTML_OUTPUT_FILE: join(OUTPUT_DIR, 'index.html'),

    STATIC_OUTPUT_DIR,
    CSS_OUTPUT_FILE: join(STATIC_OUTPUT_DIR, opts.outputCSS),
    JS_OUTPUT_FILE: join(STATIC_OUTPUT_DIR, opts.outputJS),

    TMP_DIR
  };
};
