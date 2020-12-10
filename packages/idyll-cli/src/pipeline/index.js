const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);
const { copy, pathExists } = require('fs-extra');
const compile = require('idyll-compiler');
const Terser = require('terser');
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

const build = (opts, paths, resolvers) => {
  // always store source in opts.inputString
  if (paths.IDYLL_INPUT_FILE) {
    try {
      opts.inputString = fs.readFileSync(paths.IDYLL_INPUT_FILE, 'utf8');
    } catch (e) {
      throw new errors.OutsideOfProjectError();
    }
  }

  // opts.compilerOptions is kept for backwards compatability
  return compile(
    opts.inputString,
    opts.compiler || opts.compilerOptions,
    opts.alias
  )
    .then(ast => {
      return Promise.try(() => {
        const template = fs.readFileSync(paths.HTML_TEMPLATE_FILE, 'utf8');

        /* Change here */
        resolvers.set('components', new ComponentResolver(opts, paths));

        let nameArray = [];
        getComponentNodes(ast).forEach(node => {
          if (['var', 'derived', 'data'].indexOf(node.type) > -1) {
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

        const data = getDataNodes(ast).reduce(
          (acc, { name, source, async }) => {
            let { resolvedName, data } = resolvers
              .get('data')
              .resolve(name, source, async);
            acc[resolvedName] = data;
            return acc;
          },
          {}
        );

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
          output.html = getBaseHTML(ast, template, opts);
        } else {
          output.html = getHTML(
            paths,
            ast,
            output.components,
            output.data,
            template,
            opts
          );
        }
      });
    })
    .then(() => {
      return bundleJS(opts, paths, output); // create index.js bundle
    })
    .then(js => {
      // minify bundle if necessary and store it
      if (opts.minify) {
        js = Terser.minify(js, {
          mangle: { keep_fnames: true }
        }).code;
      }
      output.js = js;
    })
    .then(() => {
      return Promise.all([
        writeFile(paths.JS_OUTPUT_FILE, output.js),
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
    })
    .then(() => {
      return output; // return all results
    });
};

const updateCSS = (paths, css) => {
  output.css = css.resolve();
  return writeFile(paths.CSS_OUTPUT_FILE, output.css).then(() => {
    return output; // return all results
  });
};

module.exports = {
  build,
  updateCSS
};
