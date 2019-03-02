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

/**
 * function that returns the names of the passed node
 * @param {*} node
 * @return {String} name of the node
 */
const getNodeName = function(node) {
  return node[0];
};

const createNode = function(name, props, children) {
  let node = [name, [], children || []];
  node = setProperties(node, props || {});
  return node;
};

/**
 * Creates a textnode with the text passed
 * @param {*} text      the text inside a textnode
 */
const createTextNode = function(text) {
  if (typeof text === 'string') {
    return text;
  }
};

const getChildren = function(node) {
  if (typeof node === 'string') {
    return [];
  }
  if (typeof node[2] === 'string') {
    return [node[2]];
  }
  return node[2] || [];
};

const getText = function(node) {
  const texts = [];
  walkNodes(node, n => {
    if (typeof n === 'string') {
      texts.push(n);
    }
  });
  return texts.join(' ');
};

const walkNodes = function(ast, f) {
  (ast || []).forEach(node => {
    walkNodes(getChildren(node), f);
    f(node);
  });
};

/**
 * function to do a depth first traversal on the ast tree.
 * @param {*} ast     Array that forms the tree structure
 * @param {*} f       call-back function
 */
const walkNodesBreadthFirst = function(ast, f) {
  let childAst = [];
  (ast || []).forEach(node => {
    f(node);
    childAst = childAst.concat(getChildren(node));
  });
  if (childAst.length !== 0) {
    walkNodesBreadthFirst(childAst, f);
  }
};
const findNodes = function(ast, filter) {
  var result = [];
  walkNodes(ast, node => {
    if (filter(node)) result.push(node);
  });
  return result;
};

const modifyChildren = function(node, modifier) {
  if (typeof node === 'string') {
    return node;
  }
  node[2] = getChildren(node).map(child => {
    return modifier(child);
  });
  return node;
};

// TODO: wrap string in array so that the reduce doesn't err
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

  // if (typeof ast === 'string') {
  //   ast = [ast];
  // }

  return ast.reduce(handleNode, []);
};

const filterChildren = function(node, filter) {
  if (typeof node === 'string') {
    return node;
  }
  node[2] = getChildren(node).filter(child => {
    return filter(child);
  });
  return node;
};

const filterNodes = function(ast, filter) {
  return ast.filter(filter).map(node => {
    if (typeof node === 'string') {
      return node;
    }

    node[2] = filterNodes(node[2] || [], filter);
    return node;
  });
};

const modifyNodesByName = function(ast, name, modifier) {
  const handleNode = node => {
    if (typeof node === 'string') {
      return node;
    }
    if (node[0].toLowerCase() === name.toLowerCase()) {
      node = modifier(node);
    }

    node = modifyChildren(node, handleNode);
    return node;
  };

  ast = ast.map(node => {
    return handleNode(node);
  });
  return ast;
};

const getProperty = function(node, key) {
  if (typeof node === 'string') {
    return null;
  }
  let retProp;
  node[1].forEach(element => {
    if (element[0] === key) {
      retProp = element[1];
    }
  });
  return retProp;
};

const getProperties = function(node) {
  if (typeof node === 'string') {
    return [];
  }
  return node[1] || [];
};

const getPropertiesByType = function(node, type) {
  if (typeof node === 'string') {
    return [];
  }
  return (node[1] || []).filter(([propName, [propType, propValue]]) => {
    return propType === type;
  });
};

const prependNode = function(ast, node) {
  return prependNodes(ast, [node]);
};

const prependNodes = function(ast, nodes) {
  return [].concat(nodes, ast);
};

const removeNodesByName = function(ast, name) {
  return filterNodes(ast, node => {
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
  if (typeof node === 'string') {
    console.warn('Cannot setPropery on string node.');
    return node;
  }

  let hasSet = false;
  const isArr = Array.isArray(value);
  node[1] = node[1].map(element => {
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
  if (typeof node === 'string') {
    console.warn('Cannot setProperties of string node.');
    return node;
  }
  Object.keys(properties).forEach(key => {
    node = setProperty(node, key, properties[key]);
  });
  return node;
};

const removeProperty = function(node, key) {
  if (typeof node === 'string') {
    console.warn('Cannot removePropery of string node.');
    return node;
  }
  node[1] = node[1].filter(([propName, propVal]) => {
    if (propName === key) {
      return false;
    }
    return true;
  });
  return node;
};

module.exports = {
  appendNode,
  appendNodes,
  createNode,
  createTextNode,
  walkNodesBreadthFirst,
  getChildren,
  getNodesByName,
  filterChildren,
  filterNodes,
  modifyChildren,
  modifyNodesByName,
  getNodeName,
  getProperty,
  getProperties,
  getPropertiesByType,
  getText,
  prependNode,
  prependNodes,
  removeNodesByName,
  setProperties,
  setProperty,
  removeProperty,
  walkNodes,
  findNodes
};
