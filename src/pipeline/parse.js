const fs = require('fs');
const path = require('path');
const htmlTags = require('html-tags');
const mustache = require('mustache');
const resolve = require('resolve');
const Baby = require('babyparse');
const { paramCase } = require('change-case');

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

const getComponents = (ast, inputDir, inputCfg, customComponentFiles, componentFiles, TMP_PATH, CUSTOM_COMPONENTS_FOLDER, DEFAULT_COMPONENTS_FOLDER) => {
  const ignoreNames = ['var', 'data', 'meta', 'derived'];
  const componentNodes = getNodesByName(s => !ignoreNames.includes(s), ast);

  const components = componentNodes.reduce(
    (acc, node) => {
      const name = paramCase(node[0].split('.')[0]);

      if (!acc[name]) {
        if (inputCfg.components[name]) {
          const compPath = path.parse(path.join(inputDir, inputCfg.components[name]));
          acc[name] = path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/');
        } else if (customComponentFiles.indexOf(name + '.js') > -1) {
          acc[name] = path.relative(TMP_PATH, path.join(CUSTOM_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
        } else if (componentFiles.indexOf(name + '.js') > -1) {
          acc[name] = path.relative(TMP_PATH, path.join(DEFAULT_COMPONENTS_FOLDER, name)).replace(/\\/g, '/');
        } else {
          try {
            // npm modules are required via relative paths to support working with a locally linked idyll
            const compPath = path.parse(resolve.sync(name, {basedir: inputDir}));
            acc[name] = path.join(path.relative(TMP_PATH, compPath.dir), compPath.base).replace(/\\/g, '/');
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

const getData = (ast, DATA_FOLDER) => {
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
        acc[name] = Baby.parseFiles(path.join(DATA_FOLDER, source), { header: true }).data;
      } else {
        acc[name] = require(path.join(DATA_FOLDER, source));
      }

      return acc;
    },
    {}
  );

  return `module.exports = ${JSON.stringify(data)}`;
}

const getHTML = (ast, template) => {
  // there should only be one meta node
  const metaNodes = getNodesByName('meta', ast);

  // data is stored in props, hence [1]
  const meta = metaNodes.length && metaNodes[0][1].reduce(
    (acc, prop) => {
      acc[prop[0]] = prop[1][1];
      return acc;
    },
    {}
  )

  // const InteractiveDocument = require('./client/component');
  // meta.idyllContent = ReactDOMServer.renderToString(React.createElement(InteractiveDocument));
  return mustache.render(template, meta || {});
}

const filterAST = (ast) => {
  const ignoreNames = ['meta'];

  return ast.filter(
    (node) => {
      return typeof node === 'string' || !ignoreNames.includes(paramCase(node[0]));
    }
  );
};

module.exports = function (ast, inputDir, inputCfg, customComponentFiles, componentFiles, {HTML_TEMPLATE, DATA_FOLDER, TMP_PATH, CUSTOM_COMPONENTS_FOLDER, DEFAULT_COMPONENTS_FOLDER}) {
  return {
    ast: JSON.stringify(filterAST(ast)),
    components: getComponents(ast, inputDir, inputCfg, customComponentFiles, componentFiles, TMP_PATH, CUSTOM_COMPONENTS_FOLDER, DEFAULT_COMPONENTS_FOLDER),
    data: getData(ast, DATA_FOLDER),
    html: getHTML(ast, fs.readFileSync(HTML_TEMPLATE, 'utf8'))
  }
}
