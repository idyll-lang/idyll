
const smartquotes = require('smartquotes');

const { modifyNodesByName, modifyChildren, getNodesByName, prependNodes, removeNodesByName, removeProperty, setProperty, getProperty } = require('idyll-ast');


const attrConvert = (list) => {
  return (list || []).reduce(
    (acc, [name, [type, val]]) => {
      if (type === 'value') {
        acc[name] = val;
      }
      return acc;
    },
    {}
  )
};

const cleanResults = (ast, options) => {
  if (typeof ast === 'string') {
    if (options.smartquotes) {
      return smartquotes(ast);
    }
    return ast;
  }

  return ast.map((node) => {
    if (typeof node === 'string') {
      if (options.smartquotes) {
        return smartquotes(node);
      }
      return node;
    }

    node[2] = flattenChildren(node[2]);

    const name = node[0].toLowerCase();
    if (name !== 'p' && name !== 'textcontainer'
      && node[2].length === 1
      && typeof node[2][0] !== 'string'
      && node[2][0][0] === 'p'
      && node[2][0][2]
      && node[2][0][2].length === 1
      && typeof node[2][0][2][0] === 'string') {
        return [node[0], node[1], node[2][0][2]];
    }


    // don't apply cleaning to codeblocks
    if (['pre', 'code', 'codehighlight'].indexOf(node[0].toLowerCase()) > -1) {
      return node;
    }
    return [node[0], node[1], cleanResults(node[2], options)];
  })
};

const flattenChildren = (ast) => {
  return (ast || []).reduce((acc, child) => {
    if (child[0] === '_idyllContainer') {
      acc = acc.concat(child[2]);
    } else {
      acc.push(child);
    }
    return acc;
  }, []);
};

const makeFullWidth = (ast) => {
  let currentTextContainer = [];
  const reduced = (ast || []).reduce((acc, child) => {
    if (typeof child === 'string') {
      currentTextContainer.push(child);
      return acc;
    }
    const attrs = attrConvert(child[1] || []);
    const childName = child[0].toLowerCase();
    if (['derived', 'var', 'data', 'fullwidth', 'scroller'].indexOf(childName) > -1 || attrs.fullWidth) {
      if (childName === 'fullwidth') {
        child[0] = 'div';
        const className = getProperty(child, 'className');
        if (className) {
          switch (className[0]) {
            case 'value':
              child = setProperty(child, 'className', ['value', 'fullWidth ' + className[1]]);
              break;
            case 'expression':
              child = setProperty(child, 'className', ['expression', `"fullWidth " + (${className[1]})`]);
              break;
            case 'variable':
              child = setProperty(child, 'className', ['expression', `"fullWidth " + (${className[1]})`]);
              break;
            default:
              child = setProperty(child, 'className', ['value', 'fullWidth']);
          }
        } else {
          child = setProperty(child, 'className', ['value', 'fullWidth']);
        }
      } else {
        child = removeProperty(child, 'fullWidth');
      }

      if (currentTextContainer.length) {
        acc = acc.concat([['TextContainer', [], currentTextContainer], child]);
      } else {
        acc = acc.concat([child]);
      }
      currentTextContainer = [];
    } else {
      currentTextContainer.push(child);
    }
    return acc;
  }, []);

  if (currentTextContainer.length) {
    return reduced.concat([['TextContainer', [], currentTextContainer]]);
  }
  return reduced;
};

const hoistVariables = (ast) => {
  const vars = getNodesByName(ast, 'var');
  const derived = getNodesByName(ast, 'derived');
  const data = getNodesByName(ast, 'data');

  ast = removeNodesByName(ast, 'var');
  ast = removeNodesByName(ast, 'derived');
  ast = removeNodesByName(ast, 'data');

  ast = prependNodes(ast, derived);
  ast = prependNodes(ast, data);
  ast = prependNodes(ast, vars);

  return ast;
};

const wrapText = (ast) => {
  return modifyNodesByName(ast, 'TextContainer', (node) => {
    return modifyChildren(node, (child) => {
      if (typeof child === 'string') {
        return ['p', [], [child]];
      }
      return child;
    })
  })
}

module.exports = {
  cleanResults,
  flattenChildren,
  hoistVariables,
  makeFullWidth,
  wrapText
}