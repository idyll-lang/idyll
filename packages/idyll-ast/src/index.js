/**
 *
 * module contains utility functions
 * for dealing with Idyll's internal representation
 * of an AST. The ast object is an array of nodes,
 * where each node is defined like:
 *
 * [ name, [
 *      [property1, [valueType, value ]],
*       [property2, [valueType, value ]]
*    ], [
*  child1,
*  child2,
*  ...
* ] ]
*
*/


const appendNode = function(ast, node) {
  return appendNodes(ast, [node]);
};

const appendNodes = function(ast, nodes) {
  return [].concat(ast, nodes);
};

const createNode = function(name, props, children) {
  let node = [name, [], children || []];
  node = setProperties(node, props || {});
  return node;
};

const getChildren = function(node) {
  return node[2] || [];
};

const modifyChildren = function(node, modifier) {
  if (typeof node === 'string') {
    return node;
  }
  node[2] = getChildren(node).map((child) => {
    return modifier(child);
  });
  return node;
};

const getNodesByName = function(ast, name) {
  const handleNode = (acc, node) => {
    if (node[0].toLowerCase() === name.toLowerCase()) {
      acc.push(node);
    }

    const children = getChildren(node);

    if (!children || typeof children === 'string') {
      return acc;
    }

    return children.reduce(handleNode, acc);
  };

  return ast.reduce(handleNode, []);
};

const filterChildren = function(node, filter) {
  if (typeof node === 'string') {
    return node;
  }
  node[2] = getChildren(node).filter((child) => {
    return filter(child);
  });
  return node;
};

const filterNodes = function(ast, filter) {
  return ast.filter(filter).map((node) => {
    if (typeof node === 'string') {
      return node;
    }

    node[2] = filterNodes(node[2] || [], filter);
    return node;
  })
};

const modifyNodesByName = function(ast, name, modifier) {
  const handleNode = (node) => {
    if (typeof node === 'string') {
      return node;
    }
    if (node[0].toLowerCase() === name.toLowerCase()) {
      node = modifier(node);
    }

    node = modifyChildren(node, handleNode);
    return node;
  }

  ast = ast.map((node) => {
    return handleNode(node);
  });
  return ast;
};

const getProperty = function(node, key) {
  node[1].forEach((element) => {
    if (element[0] === key) {
      return element[1];
    }
  });
};

const prependNode = function(ast, node) {
  return prependNodes(ast, [node]);
};

const prependNodes = function(ast, nodes) {
  return [].concat(nodes, ast);
};

const removeNodesByName = function(ast, name) {
  return filterNodes(ast, (node) => {
    if (typeof node === 'string') {
      return true;
    }
    if (node[0].toLowerCase() === name.toLowerCase()) {
      return false;
    }
    return true;
  });
};

const setProperty = function(node, key, value) {
  let hasSet = false;
  const isArr = Array.isArray(value);
  node[1] = node[1].map((element) => {
      if (element[0] === key) {
        hasSet = true;
        return [element[0], isArr ? value : ['value', value]];
      }
      return element;
  });
  if (!hasSet) {
    node[1] = node[1].concat([[key, isArr ? value : ['value', value]]]);
  }

  return node;
};

const setProperties = function(node, properties) {
  Object.keys(properties).forEach((key) => {
    node = setProperty(node, key, properties[key]);
  })
  return node;
};

const removeProperty = function(node, key) {
  node[1] = node[1].filter(([propName, propVal]) => {
    if (propName === key) {
      return false;
    }
    return true;
  })
  return node;
};

module.exports = {
  appendNode,
  appendNodes,
  createNode,
  getChildren,
  getNodesByName,
  filterChildren,
  filterNodes,
  modifyChildren,
  modifyNodesByName,
  getProperty,
  prependNode,
  prependNodes,
  removeNodesByName,
  setProperties,
  setProperty,
  removeProperty
}