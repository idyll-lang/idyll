const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);
const UglifyJS = require('uglify-js');
const compile = require('./compile');
const {
  getASTJSON,
  getComponentsJS,
  getDataJS,
  getHTML
} = require('./parse');
const css = require('./css');
const write = require('./write-artifacts');
const bundleJS = require('./bundle-js');
const writeJS = require('./write-js');

let outputs = {};

const build = (opts, paths, inputConfig) => {
  // always store source in opts.inputString
  if (paths.IDYLL_INPUT_FILE) {
    opts.inputString = fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8');
  }

  const ast = compile(opts.inputString, opts.compilerOptions);
  const tree = {
    ast: getASTJSON(ast),
    components: getComponentsJS(ast, paths, inputConfig),
    css: css(opts),
    data: getDataJS(ast, paths.DATA_DIR),
    html: getHTML(ast, fs.readFileSync(paths.HTML_TEMPLATE_FILE, 'utf8'))
  };

  return write(tree, paths)
    .then(() => {
      return bundleJS(paths);
    })
    .then((js) => {
      if (opts.minify) {
        js = UglifyJS.minify(js, {fromString: true}).code;
      }
      tree.js = js;
      return writeFile(paths.JS_OUTPUT_FILE, tree.js);
    })
    .then(() => {
      return tree;
    });
}

const updateCSS = (opts, paths) => {
  outputs.css = css(opts);
  return writeFile(paths.CSS_OUTPUT_FILE, outputs.css);
}

module.exports = {
  build,
  updateCSS
}
