const {
  dirname,
  isAbsolute,
  join,
  parse,
  resolve,
  relative
} = require('path');

const debug = require('debug')('idyll:cli')

module.exports = function (opts) {
  const basedir = opts.inputFile
    ? isAbsolute(opts.inputFile)
      ? dirname(opts.inputFile)
      : dirname(join(process.cwd(), opts.inputFile))
    : process.cwd();

  const getPath = (p) => {
    if (!p) return undefined;
    if (isAbsolute(p)) return p;
    return join(basedir, p);
  }

  const getComponentDirs = (paths) => {
    if (paths instanceof Array) return paths.map(p => getPath(p));
    return [getPath(paths)];
  }

  const OUTPUT_DIR = getPath(opts.output);
  const STATIC_OUTPUT_DIR = join(OUTPUT_DIR, 'static');
  const TMP_DIR = getPath(opts.temp);

  return {
    APP_PATH: resolve(__dirname, '..'),
    CSS_INPUT_FILE: getPath(opts.css),
    DATA_DIR: getPath(opts.datasets),
    STATIC_DIR: getPath(opts.static),
    COMPONENT_DIRS: getComponentDirs(opts.components),
    DEFAULT_COMPONENT_DIRS: getComponentDirs(opts.defaultComponents),
    HTML_TEMPLATE_FILE: getPath(opts.template),
    IDYLL_INPUT_FILE: getPath(opts.inputFile),
    INPUT_DIR: basedir,
    PACKAGE_FILE: getPath('package.json'),

    OUTPUT_DIR,
    HTML_OUTPUT_FILE: join(OUTPUT_DIR, 'index.html'),

    STATIC_OUTPUT_DIR,
    CSS_OUTPUT_FILE: join(STATIC_OUTPUT_DIR, '__idyll_styles.css'),
    JS_OUTPUT_FILE: join(STATIC_OUTPUT_DIR, '__idyll_index.js'),

    TMP_DIR
  };
}
