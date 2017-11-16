const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);
const compile = require('idyll-compiler');
const UglifyJS = require('uglify-js');
const {
  getASTJSON,
  getComponentsJS,
  getDataJS,
  getHighlightJS,
  getBaseHTML,
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
      const template = fs.readFileSync(paths.HTML_TEMPLATE_FILE, 'utf8');

      output = {
        ast: getASTJSON(ast),
        components: getComponentsJS(ast, paths, inputConfig),
        css: css(opts),
        data: getDataJS(ast, paths.DATA_DIR),
        syntaxHighlighting: getHighlightJS(ast, paths),
        opts: {
          ssr: opts.ssr
        }
      };
      if (!opts.ssr) {
        output.html = getBaseHTML(ast, template);
      } else {
        output.html = getHTML(
          paths,
          ast,
          output.components,
          output.data,
          template
        );
      }
    }
  )
  .then(() => {
    return bundleJS(opts, paths, output); // create index.js bundle
  })
  .then((js) => {
    // minify bundle if necessary and store it
    if (opts.minify) {
      js = UglifyJS.minify(js, {fromString: true, mangle: { keep_fnames: true}}).code;
    }
    output.js = js;
  })
  .then(() => {
    return Promise.all([
      writeFile(paths.JS_OUTPUT_FILE, output.js),
      writeFile(paths.CSS_OUTPUT_FILE, output.css),
      writeFile(paths.HTML_OUTPUT_FILE, output.html),
    ]);
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
