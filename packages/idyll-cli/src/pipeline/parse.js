const path = require('path');
const mustache = require('mustache');
const resolve = require('resolve');
const slash = require('slash');

const {
  getProperty,
  getNodeType,
  getNodeName,
  getPropertyKeys,
  isTextNode,
  queryNodes
} = require('idyll-ast');

exports.getComponentNodes = ast => {
  const ignoreTypes = new Set(['var', 'data', 'meta', 'derived']);
  return queryNodes(
    ast,
    node =>
      !isTextNode(node) && !ignoreTypes.has(getNodeType(node).toLowerCase())
  );
};

exports.getDataNodes = ast => {
  const nodes = queryNodes(ast, node => getNodeType(node) === 'data');
  return nodes.map(node => {
    return {
      node,
      name: getProperty(node, 'name'),
      source: getProperty(node, 'source'),
      async: getProperty(node, 'async')
    };
  });
};

exports.getHighlightJS = (ast, paths, server) => {
  // load react-syntax-highlighter from idyll's node_modules directory
  const languageMap = {
    js: 'javascript',
    html: 'htmlbars'
  };

  const codeHighlightNodes = queryNodes(
    ast,
    node => getNodeName(node) === 'CodeHighlight'
  );
  if (!codeHighlightNodes.length) {
    return ' ';
  }

  const languages = codeHighlightNodes.reduce((acc, dataNode) => {
    const language = dataNode.properties.language.value;
    acc[language] = true;
    return acc;
  }, {});

  if (server) {
    const rshPath = slash(
      path.dirname(
        resolve.sync('react-syntax-highlighter', {
          basedir: paths.DEFAULT_COMPONENTS_DIR
        })
      )
    );
    const rsh = require(slash(path.join(rshPath, 'light')));
    Object.keys(languages).forEach(language => {
      let cleanedLanguage = language;
      if (languageMap[language]) {
        cleanedLanguage = languageMap[language];
      }
      try {
        rsh.registerLanguage(
          language,
          require(slash(path.join(rshPath, 'languages', cleanedLanguage)))
            .default
        );
      } catch (e) {
        console.warn(
          `Warning: could not find syntax highlighter for ${language}`
        );
      }
    });
    return;
  }
  const rshPath = slash(
    path.dirname(
      resolve.sync('react-syntax-highlighter', {
        basedir: paths.DEFAULT_COMPONENTS_DIR
      })
    )
  );

  let js = `var rsh = require('${slash(path.join(rshPath, 'light'))}')`;
  Object.keys(languages).forEach(language => {
    let cleanedLanguage = language;
    if (languageMap[language]) {
      cleanedLanguage = languageMap[language];
    }
    try {
      js += `
        try {
          rsh.registerLanguage('${language}', require('${slash(
        path.join(rshPath, 'languages', cleanedLanguage)
      )}').default);
        } catch(e) {
          console.warn("Warning: could not find syntax highlighter for ${language}");
        }
      `;
    } catch (e) {
      console.warn(
        `Warning: not including syntax highlighting for ${language}`
      );
    }
  });

  return js;
};

const parseMeta = ast => {
  // there should only be one meta node
  const metaNodes = queryNodes(ast, node => getNodeType(node) === 'meta');

  let metaProperties = {};
  if (metaNodes.length > 1) {
    console.warn('There is more than one meta node.');
  } else if (metaNodes.length === 1) {
    getPropertyKeys(metaNodes[0]).forEach(key => {
      metaProperties[key] = getProperty(metaNodes[0], key).value;
    });
  }
  return metaProperties;
};

const formatFont = fontName => {
  return fontName.split(' ').join('+');
};

const getGoogleFontsUrl = ({ googleFonts }) => {
  if (!googleFonts) {
    return null;
  }

  let url = 'https://fonts.googleapis.com/css?family=';

  if (googleFonts && typeof googleFonts === 'string') {
    return url + formatFont(googleFonts);
  } else if (googleFonts && googleFonts.length) {
    return url + googleFonts.map(formatFont).join('|');
  }

  return null;
};

exports.getBaseHTML = (ast, template, opts) => {
  return mustache.render(
    template,
    Object.assign(
      {
        favicon: opts.favicon,
        googleFontsUrl: getGoogleFontsUrl(opts),
        staticOutputDir: opts.staticOutputDir || 'static',
        outputJS: opts.outputJS,
        outputCSS: opts.outputCSS
      },
      parseMeta(ast)
    )
  );
};

exports.getHTML = async (paths, ast, _components, datasets, template, opts) => {
  const components = {};

  for (key of Object.keys(_components)) {
    // .forEach(key => {
    delete require.cache[require.resolve(_components[key])];
    try {
      components[key] = require(_components[key]);
    } catch (e) {
      // console.log(e);
      try {
        components[key] = await import(_components[key]);
      } catch (er) {
        console.warn(
          `Could not import component ${key} for server-side rendering.`
        );
        console.error(er);
        components[key] = () => null;
      }
    }
  }
  exports.getHighlightJS(ast, paths, true);
  const ReactDOMServer = require('react-dom/server');
  const React = require('react');
  const IdyllDocument = require('idyll-document');
  const meta = parseMeta(ast);
  const context = require(opts.context
    ? opts.context
    : __dirname + '/../client/context');

  meta.idyllContent = ReactDOMServer.renderToString(
    React.createElement(IdyllDocument, {
      ast: ast,
      components,
      datasets,
      context,
      theme: opts.theme,
      layout: opts.layout,
      authorView: opts.authorView
    })
  ).trim();

  return mustache.render(
    template,
    Object.assign(
      {
        favicon: opts.favicon,
        usesTex: components.equation,
        googleFontsUrl: getGoogleFontsUrl(opts),
        staticOutputDir: opts.staticOutputDir || 'static',
        outputJS: opts.outputJS,
        outputCSS: opts.outputCSS
      },
      meta
    )
  );
};
