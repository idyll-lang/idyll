const fs = require('fs');
const path = require('path');
const htmlTags = require('html-tags');
const mustache = require('mustache');
const resolve = require('resolve');
const Baby = require('babyparse');
const { paramCase } = require('change-case');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

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
  const customComponentFiles = COMPONENTS_DIR ? fs.readdirSync(COMPONENTS_DIR) : [];

  const components = componentNodes.reduce(
    (acc, node) => {
      const name = paramCase(node[0].split('.')[0]);

      if (!acc[name]) {
        if (inputConfig.components[name]) {
          const compPath = path.parse(path.join(INPUT_DIR, inputConfig.components[name]));
          acc[name] = path.join(path.relative(TMP_DIR, compPath.dir), compPath.base).replace(/\\/g, '/');
        } else if (customComponentFiles.indexOf(name + '.js') > -1) {
          acc[name] = path.relative(TMP_DIR, path.join(COMPONENTS_DIR, name)).replace(/\\/g, '/');
        } else if (componentFiles.indexOf(name + '.js') > -1) {
          acc[name] = path.relative(TMP_DIR, path.join(DEFAULT_COMPONENTS_DIR, name)).replace(/\\/g, '/');
        } else {
          try {
            // npm modules are required via relative paths to support working with a locally linked idyll
            const compPath = path.parse(resolve.sync(name, {basedir: INPUT_DIR}));
            acc[name] = path.join(path.relative(TMP_DIR, compPath.dir), compPath.base).replace(/\\/g, '/');
          } catch (err) {
            if (htmlTags.indexOf(node[0].toLowerCase()) === -1) {
              throw new Error(`Component named ${node[0]} could not be found.`)
            }
          }
        }
      }

      return acc;
    },
    {}
  );

  const src = Object.keys(components)
    .map((key) => {
      return `'${key}': require('${components[key]}')`;
    })
    .join(',\n\t');

  return `module.exports = {\n\t${src}\n}\n`;
}

exports.getDataJS = (ast, DATA_DIR) => {
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
        acc[name] = Baby.parseFiles(path.join(DATA_DIR, source), { header: true }).data;
      } else {
        acc[name] = require(path.join(DATA_DIR, source));
      }

      return acc;
    },
    {}
  );

  return `module.exports = ${JSON.stringify(data)}`;
}

exports.getHTML = (ast, template) => {
  // there should only be one meta node
  const metaNodes = getNodesByName('meta', ast);

  // data is stored in props, hence [1]
  const meta = metaNodes.length && metaNodes[0][1].reduce(
    (acc, prop) => {
      acc[prop[0]] = prop[1][1];
      return acc;
    },
    {}
  ) || {};

  const InteractiveDocument = require('../client/component');
  meta.idyllContent = ReactDOMServer.renderToString(React.createElement(InteractiveDocument, {ast: ast}));

  return mustache.render(template, meta || {});
}

exports.getASTJSON = (ast) => {
  const ignoreNames = ['meta'];

  return JSON.stringify(
    ast.filter((node) => {
      return typeof node === 'string' || !ignoreNames.includes(paramCase(node[0]));
    })
  );
}
