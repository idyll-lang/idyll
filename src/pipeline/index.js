const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);
const compile = require('idyll-compiler');
const UglifyJS = require('uglify-js');
const {
  getASTJSON,
  getComponentsJS,
  getDataJS,
  getHTML
} = require('./parse');
const css = require('./css');
const bundleJS = require('./bundle-js');

let output;

const build = (opts, paths, inputConfig) => {
  // always store source in opts.inputString
  if (paths.IDYLL_INPUT_FILE) {
    opts.inputString = fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8');
  }

  return Promise.try(
    // this is all synchronous so we wrap it with Promise.try
    // to start a Promise chain and turn any synchronous exceptions into a rejection
    () => {
      const ast = compile(opts.inputString, opts.compilerOptions);
      output = {
        ast: getASTJSON(ast),
        components: getComponentsJS(ast, paths, inputConfig),
        css: css(opts),
        data: getDataJS(ast, paths.DATA_DIR),
        html: getHTML(ast, fs.readFileSync(paths.HTML_TEMPLATE_FILE, 'utf8'))
      };
    }
  )
  .then(() => {
    // write everything but JS to disk
    return Promise.all([
      writeFile(paths.AST_OUTPUT_FILE, output.ast),
      writeFile(paths.COMPONENTS_OUTPUT_FILE, output.components),
      writeFile(paths.CSS_OUTPUT_FILE, output.css),
      writeFile(paths.DATA_OUTPUT_FILE, output.data),
      writeFile(paths.HTML_OUTPUT_FILE, output.html),
    ]);
  })
  .then(() => {
    return bundleJS(paths); // create index.js bundle
  })
  .then((js) => {
    // minify bundle if necessary and store it
    if (opts.minify) {
      js = UglifyJS.minify(js, {fromString: true}).code;
    }
    output.js = js;
  })
  .then(() => {
    writeFile(paths.JS_OUTPUT_FILE, output.js); // write JS to disk
  })
  .then(() => {
    return output; // return all results
  });
}

const updateCSS = (opts, paths) => {
  output.css = css(opts);
  return writeFile(paths.CSS_OUTPUT_FILE, output.css)
    .then(() => {
      return output; // return all results
    });
}

module.exports = {
  build,
  updateCSS
}
