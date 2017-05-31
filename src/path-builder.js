const fs = require('fs');
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

  const OUTPUT_DIR = getPath(opts.output);
  const TMP_DIR = getPath('.idyll');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

  return {
    CSS_INPUT_FILE: getPath(opts.css),
    COMPONENTS_DIR: getPath(opts.components),
    DATA_DIR: getPath(opts.datasets),
    DEFAULT_COMPONENTS_DIR: getPath(opts.defaultComponents),
    HTML_TEMPLATE_FILE: getPath(opts.template),
    IDYLL_INPUT_FILE: getPath(opts.inputFile),
    INPUT_DIR: basedir,
    PACKAGE_FILE: getPath('package.json'),

    OUTPUT_DIR,
    CSS_OUTPUT_FILE: join(OUTPUT_DIR, 'styles.css'),
    HTML_OUTPUT_FILE: join(OUTPUT_DIR, 'index.html'),
    JS_OUTPUT_FILE: join(OUTPUT_DIR, 'index.js'),
    TMP_DIR,
    AST_OUTPUT_FILE: join(TMP_DIR, 'ast.json'),
    COMPONENTS_OUTPUT_FILE: join(TMP_DIR, 'components.js'),
    SYNTAX_OUTPUT_FILE: join(TMP_DIR, 'syntax-highlighters.js'),
    DATA_OUTPUT_FILE: join(TMP_DIR, 'data.js')
  };
}
