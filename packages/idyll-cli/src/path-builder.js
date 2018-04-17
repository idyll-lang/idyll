const {
  dirname,
  isAbsolute,
  join,
  parse,
  resolve
} = require('path');

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
  const TMP_DIR = getPath(opts.temp);

  return {
    APP_PATH: resolve(__dirname, '..'),
    CSS_INPUT_FILE: getPath(opts.css),
    DATA_DIR: getPath(opts.datasets),
    COMPONENT_DIRS: getComponentDirs(opts.components),
    DEFAULT_COMPONENT_DIRS: getComponentDirs(opts.defaultComponents),
    HTML_TEMPLATE_FILE: getPath(opts.template),
    IDYLL_INPUT_FILE: getPath(opts.inputFile),
    INPUT_DIR: basedir,
    PACKAGE_FILE: getPath('package.json'),

    OUTPUT_DIR,
    CSS_OUTPUT_FILE: join(OUTPUT_DIR, 'styles.css'),
    HTML_OUTPUT_FILE: join(OUTPUT_DIR, 'index.html'),
    JS_OUTPUT_FILE: join(OUTPUT_DIR, 'index.js'),
    TMP_DIR
  };
}
