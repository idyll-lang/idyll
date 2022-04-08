const fs = require('fs');
const { writeFile } = fs.promises;
const { copy, pathExists } = require('fs-extra');
const { isVariableNode } = require('idyll-ast');
const compile = require('idyll-compiler');
const { paramCase } = require('change-case');
const debug = require('debug')('idyll:cli');
const { ComponentResolver } = require('../resolvers');

const {
  getComponentNodes,
  getDataNodes,
  getHighlightJS,
  getBaseHTML,
  getHTML
} = require('./parse');
const bundleJS = require('./bundle-js');
const errors = require('../errors');

let output;

const build = async (opts, paths, resolvers) => {
  // always store source in opts.inputString
  if (paths.IDYLL_INPUT_FILE) {
    try {
      opts.inputString = fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8');
    } catch (e) {
      throw new errors.OutsideOfProjectError();
    }
  }

  const ast =
    opts.ast ||
    (await compile(opts.inputString, {
      ...opts.compiler,
      paths,
      alias: opts.alias
    }));

  const template = fs.readFileSync(paths.HTML_TEMPLATE_FILE, 'utf8');

  /* Change here */
  resolvers.set('components', new ComponentResolver(opts, paths));

  let nameArray = [];
  getComponentNodes(ast).forEach(node => {
    if (isVariableNode(node)) {
      nameArray.push(node.type);
    } else {
      // console.log('checking component names - ', node);
      nameArray.push(node.name.split('.')[0]);
    }
  });
  const uniqueComponents = Array.from(new Set(nameArray));
  const components = uniqueComponents.reduce((acc, name) => {
    let resolved = resolvers.get('components').resolve(name);
    if (resolved) acc[paramCase(name)] = resolved;
    return acc;
  }, {});

  const data = getDataNodes(ast).reduce((acc, { name, source, async }) => {
    let { resolvedName, data } = resolvers
      .get('data')
      .resolve(name, source, async);
    acc[resolvedName] = data;
    return acc;
  }, {});

  const css = resolvers.get('css').resolve();

  output = {
    ast: ast,
    components,
    data,
    css,
    syntaxHighlighting: getHighlightJS(ast, paths),
    context: opts.context,
    opts: {
      ssr: opts.ssr,
      theme: opts.theme,
      layout: opts.layout,
      authorView: opts.authorView
    }
  };
  if (!opts.ssr) {
    output.html = await getBaseHTML(ast, template, opts);
  } else {
    output.html = await getHTML(
      paths,
      ast,
      output.components,
      output.data,
      template,
      opts
    );
  }

  bundleJS(opts, paths, output);

  // write output
  await Promise.all([
    writeFile(paths.CSS_OUTPUT_FILE, output.css),
    writeFile(paths.HTML_OUTPUT_FILE, output.html),
    pathExists(paths.STATIC_DIR)
      .then(exists => {
        if (exists && paths.STATIC_DIR !== paths.STATIC_OUTPUT_DIR) {
          return copy(paths.STATIC_DIR, paths.STATIC_OUTPUT_DIR);
        }
        return null;
      })
      .catch(e => {
        debug('Error copying static files', e);
      })
  ]);

  // return all results
  return output;
};

const updateCSS = async (paths, css) => {
  output.css = css.resolve();
  await writeFile(paths.CSS_OUTPUT_FILE, output.css);
  return output; // return all results
};

module.exports = {
  build,
  updateCSS
};
