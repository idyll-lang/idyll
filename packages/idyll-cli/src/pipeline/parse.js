const fs = require('fs');
const path = require('path');
const htmlTags = require('html-tags');
const mustache = require('mustache');
const resolve = require('resolve');
const slash = require('slash');
const { paramCase, pascalCase } = require('change-case');
const Papa = require('papaparse');

const getFilteredAST = (ast) => {
  const ignoreNames = ['meta'];
  return ast.filter((node) => {
    return typeof node === 'string' || !ignoreNames.includes(paramCase(node[0]));
  });
}

const getNodesByName = (name, tree) => {
  const predicate = typeof name === 'string' ? (s) => s === name : name;

  const byName = (acc, val) => {
    if (typeof val === 'string') return acc;
    if (predicate(val[0])) acc.push(val);

    if (val[2] && typeof val[2] !== 'string') acc = val[2].reduce(byName, acc);

    return acc;
  }

  return tree.reduce(
    byName,
    []
  )
}

exports.getComponentsJS = (ast, paths, inputConfig) => {
  const ignoreNames = ['var', 'data', 'meta', 'derived'];
  const componentNodes = getNodesByName(s => !ignoreNames.includes(s), ast);
  const {
    COMPONENTS_DIR,
    DEFAULT_COMPONENTS_DIR,
    INPUT_DIR,
    TMP_DIR
  } = paths;

  const componentFiles = fs.readdirSync(DEFAULT_COMPONENTS_DIR);
  const caseInsensitive = componentFiles.map(s => s.toLowerCase());
  const customComponentFiles = fs.existsSync(COMPONENTS_DIR) ? fs.readdirSync(COMPONENTS_DIR) : [];
  const customCaseInsensitive = customComponentFiles.map(s => s.toLowerCase());

  const checkFile = (name) => {
    const customIdx = customCaseInsensitive.indexOf(name.toLowerCase() + '.js');
    const defaultIdx = caseInsensitive.indexOf(name.toLowerCase() + '.js');
    if (inputConfig.components[name]) {
      return slash(path.join(INPUT_DIR, inputConfig.components[name]));
    } else if (customIdx > -1) {
      return slash(path.join(COMPONENTS_DIR, customComponentFiles[customIdx]));
    } else if (defaultIdx > -1) {
      return slash(path.join(DEFAULT_COMPONENTS_DIR, componentFiles[defaultIdx]));
    } else {
      try {
        // npm modules are required via relative paths to support working with a locally linked idyll
        return slash(resolve.sync(name, {basedir: INPUT_DIR}));
      } catch (err) {
        return;
      }
    }
  }

  const components = componentNodes.reduce(
    (acc, node) => {
      const name = paramCase(node[0].split('.')[0]);
      if (!acc[name]) {
        const p = checkFile(pascalCase(name));
        if (p) {
          acc[name] = p;
        } else {
          const r = checkFile(name);
          if (r) {
            acc[name] = r;
          }
          else if (htmlTags.indexOf(node[0].toLowerCase()) === -1) {
            throw new Error(`Component named ${node[0]} could not be found.`)
          }
        }
      }
      return acc;
    },
    {}
  );

  return components;
}

exports.getDataJS = (ast, DATA_DIR, o) => {
  // can be multiple data nodes
  const dataNodes = getNodesByName('data', ast);

  // turn each data node into a field on an object
  // whose key is the name prop
  // and whose value is the parsed data
  const data = dataNodes.reduce(
    (acc, dataNode) => {
      const props = dataNode[1];
      const { name, source } = props.reduce(
        (hash, val) => {
          hash[val[0]] = val[1][1];
          return hash;
        },
        {}
      );

      if (source.endsWith('.csv')) {
        acc[name] = Papa.parse(slash(path.join(DATA_DIR, source)), { header: true }).data;
      } else if (source.endsWith('.json')) {
        acc[name] = require(slash(path.join(DATA_DIR, source)));
      } else {
        throw new Error('Unknown data file type: ' + source);
      }

      return acc;
    },
    {}
  );

  return data;
}


exports.getHighlightJS = (ast, paths, server) => {
  // load react-syntax-highlighter from idyll's node_modules directory
  const languageMap = {
    js: 'javascript',
    html: 'htmlbars'
  };

  const codeHighlightNodes = getNodesByName('CodeHighlight', ast);
  if (!codeHighlightNodes.length) {
    return ' ';
  }

  const languages = codeHighlightNodes.reduce(
    (acc, dataNode) => {
      const props = dataNode[1];
      const { language } = props.reduce(
        (hash, val) => {
          hash[val[0]] = val[1][1];
          return hash;
        },
        {}
      );

      acc[language] = true;
      return acc;
    },
    {}
  );

  if (server) {
    const rshPath = slash(path.dirname(resolve.sync('react-syntax-highlighter', { basedir: paths.DEFAULT_COMPONENTS_DIR })));
    const rsh = require(slash(path.join(rshPath, 'light')));
    Object.keys(languages).forEach((language) => {
      let cleanedLanguage = language;
      if (languageMap[language]) {
        cleanedLanguage = languageMap[language];
      }
      try {
        rsh.registerLanguage(language, require(slash(path.join(rshPath, 'languages', cleanedLanguage))).default);
      } catch(e) {
        console.warn(`Warning: could not find syntax highlighter for ${language}`);
      }
    });
    return;
  }
  const rshPath = slash(path.dirname(resolve.sync('react-syntax-highlighter', { basedir: paths.DEFAULT_COMPONENTS_DIR })));

  let js = `var rsh = require('${slash(path.join(rshPath, 'light'))}')`
  Object.keys(languages).forEach((language) => {
    let cleanedLanguage = language;
    if (languageMap[language]) {
      cleanedLanguage = languageMap[language];
    }
    js += `
      try {
        rsh.registerLanguage('${language}', require('${slash(path.join(rshPath, 'languages', cleanedLanguage))}').default);
      } catch(e) {
        console.warn("Warning: could not find syntax highlighter for ${language}");
      }
    `
  });

  return js;
}

const parseMeta = (ast) => {
  // there should only be one meta node
  const metaNodes = getNodesByName('meta', ast);

  // data is stored in props, hence [1]
  return metaNodes.length ? metaNodes[0][1].reduce(
    (acc, prop) => {
      acc[prop[0]] = prop[1][1];
      return acc;
    },
    {}
  ) : {};
}

exports.getBaseHTML = (ast, template) => {
  return mustache.render(template, parseMeta(ast));
}

exports.getHTML = (paths, ast, _components, datasets, template) => {
  const components = {};
  Object.keys(_components).forEach(key => {
    delete require.cache[require.resolve(_components[key])];
    components[key] = require(_components[key]);
  });

  exports.getHighlightJS(ast, paths, true);
  const ReactDOMServer = require('react-dom/server');
  const React = require('react');
  const IdyllDocument = require('idyll-document').default;
  const meta = parseMeta(ast);
  meta.idyllContent = ReactDOMServer.renderToString(
    React.createElement(IdyllDocument, {
      ast: getFilteredAST(ast),
      components,
      datasets
    })
  ).trim();
  return mustache.render(template, meta);
}

exports.getASTJSON = (ast) => {
  return getFilteredAST(ast);
}
