/**
 * @module idyll-ast
 * @description
 * This file contains utility functions for the Idyll-Ast libraray.
 * The structure and schema of the json can be found in the file ast.schema.json in
 * the package idyll-astV2.
 */

const error = require('./error');
const Ajv = require('ajv');
const ajv = new Ajv();
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const schema = require('./ast.schema.json');
const validator = ajv.compile(schema);
const validatorProps = ajv.compile(schema.properties.properties);
const converters = require('./converters');
const htmlTags = require('html-tags');

/**
 * @name appendNode
 * @type {function}
 * @description
 * Function to append a top-level child to the root element.
 * @param {object} ast   JSON-object
 * @param {object} node  JSON-object
 * @return {object} Modifed ast node
 */
const appendNode = function(ast, node) {
  checkASTandNode(ast, node);

  return appendNodes(ast, [node]);
};

/**
 * @name appendNodes
 * @type {function}
 * @description
 * Function to append multiple top-level children to the root element.
 * @param {oject} ast   JSON-object
 * @param {object[]} node  an array of JSON-objects
 * @return {object} modified ast
 */
const appendNodes = function(ast, nodes) {
  checkASTandNodeArray(ast, nodes);
  return Object.assign({}, ast, {
    children: [].concat(ast.children, nodes)
  });
};

/**
 * @name createNode
 * @type {function}
 * @description
 * Function to creat a new AST node following the schema.
 * @param {integer} id   Id of the node
 * @param {string} name  Name of the node.
 * @param {string} type Type of the node.
 * @param {string} value Value evaluation of the node
 * @param {object[]} props Properties of the node.
 * @param {object[]} children Children of the node.
 * @return {object} New component node.
 */
const createNode = function(id, name, type, props = null, children = null) {
  checkForCreateNode(id, name, type, props, children);

  let node = new Object();
  node.id = id;
  node.type = type;
  node.name = name;
  if (props) {
    node.properties = Object.assign({}, props);
  }
  if (children) {
    node.children = Object.assign({}, children);
  }
  return node;
};

/**
 * @name createTextNode
 * @description
 * Function to create a new textnode
 * @param {*} id
 * @param {*} value
 * @return New textnode
 */
const createTextNode = function(id, value) {
  typeCheckInteger(id, 'id');
  typeCheckString(value, 'value');

  let textnode = new Object();
  textnode.id = id;
  textnode.type = 'textnode';
  textnode.value = value;

  return textnode;
};

/**
 * @name getChildren
 * @type {function}
 * @description
 * Function to return the children of the passed node.
 * @param {object} node   AST node
 * @return {object[]} children of the node
 */
const getChildren = function(node) {
  typeCheckObject(node, 'node (gc)');
  runValidator(node, 'node');

  if (node.type === 'textnode') {
    return [];
  }
  if (node.children) {
    //console.log("node @ gc", node);
    return [].concat(node.children);
  } else {
    return [];
  }
};

/**
 * @name setChildren
 * @type { function }
 * @description
 * Function to set children of the passed node.
 * @param { object } node
 * @param { object } children
 * @return { object } modified node
 */
const setChildren = function(node, children) {
  typeCheckObject(node, 'node (sc)');
  runValidator(node, 'node');
  if (['textnode', 'var', 'derived', 'data'].indexOf(getType(node)) > -1) {
    return node;
    //throw new error.InvalidParameterError(getType(node) + " cannot have any children");
  }

  checkChildren(children);
  return Object.assign({}, node, { children: children });
};

const hasChildren = function(node) {
  typeCheckObject(node, 'node (hc)');
  runValidator(node, 'node');

  if (['textnode', 'var', 'derived', 'data'].indexOf(getType(node)) > -1) {
    return false;
  }

  if (node.children && node.children.length) {
    //console.log("@hasChildren", node);
    return true;
  } else {
    return false;
  }
};
/**
 * @name getNodesByName
 * @type {function}
 * @description
 * Function to get all the nodes with the passed name in the passed AST.
 * @param {object} ast  AST object
 * @param {string} name name of the nodes
 * @return {object[]} Array of nodes matching the name
 */
const getNodesByName = function(ast, name) {
  typeCheckObject(ast, 'ast');
  typeCheckString(name, 'name');
  runValidator(ast, 'ast');
  let nodes = [];
  if (name === 'article') {
    nodes.push(ast);
  }
  let otherNodes = getNodesByNameHelper(ast.children, name);
  return nodes.concat(otherNodes);
};

/*
  Helper function for getNodesByName
*/
function getNodesByNameHelper(childArray, name) {
  let nodes = [].concat(childArray.filter(element => element.name === name));
  let otherNodes = [];
  childArray.forEach(node => {
    if (hasChildren(node)) {
      otherNodes = otherNodes.concat(getNodesByNameHelper(node.children, name));
    }
  });
  return nodes.concat(otherNodes);
}

/**
 * @name getNodesByType
 * @type {function}
 * @description
 * Function to get all the nodes with the passed name in the passed AST.
 * @param {object} ast  AST object
 * @param {string} type type of the nodes
 * @return {object[]} Array of nodes matching the name
 */
const getNodesByType = function(ast, type) {
  typeCheckObject(ast, 'ast');
  typeCheckString(type, 'type');
  runValidator(ast, 'ast');
  let nodes = [];
  let otherNodes = getNodesByTypeHelper(ast.children, type);
  return nodes.concat(otherNodes);
};

/*
  Helper function for getNodesByType
*/
function getNodesByTypeHelper(childArray, type) {
  let nodes = [].concat(childArray.filter(element => element.type === type));
  let otherNodes = [];
  childArray.forEach(node => {
    if (hasChildren(node)) {
      otherNodes = otherNodes.concat(getNodesByTypeHelper(node.children, type));
    }
  });
  return nodes.concat(otherNodes);
}

/**
 * @name hasType
 * @type {function}
 * Function to check if a node has type attribute or not
 * @param {object} node
 * @return {boolean} true if type exists, false otherwise
 */
const hasType = function(node) {
  if (node.type) {
    return true;
  }
  return false;
};

/**
 * @name getType
 * @type {function}
 * @description
 * Function to get the type information of a node
 * @param {object} ast  AST object
 * @return {string} type of the node
 */
const getType = function(node) {
  typeCheckObject(node, 'node(Get type)');
  runValidator(node, 'node');

  return node.type;
};

/**
 * @name getText
 * @type {function}
 * @description
 * Function to get all the text from textnodes from the passes AST node
 * @param {object} ast AST node
 * @return {string}
 */
const getText = function(node) {
  typeCheckObject(node, 'node');
  runValidator(node, 'node');

  const texts = [];
  walkNodes(node, n => {
    if (n.type === 'textnode') {
      texts.push(n.value);
    }
  });
  return texts.join(' ');
};

/*
Change findNodes ==> filterNodes
*/
/**
 * @name filterNodes
 * @type {function}
 * @description
 * Function to find certain nodes based on a filter passed.
 * @param {object} ast   AST node
 * @param {function} filter  Filter function to find nodes
 * @return {object[]} Array of all the nodes found
 */
const filterNodes = function(ast, filter) {
  checkASTandFunction(ast, 'ast', filter, 'filter');

  let result = [];
  walkNodes(ast, node => {
    if (filter(node)) result.push(Object.assign({}, node));
  });
  return result;
};

/**
 * @name modifyChildren
 * @type {function}
 * @description
 * Function to modify children of a passed AST node using a passed modifier.
 * @param {object}  node
 * @param {function}  modifier
 * @return {object} node with modified children.
 */
const modifyChildren = function(node, modifier) {
  checkASTandFunction(node, 'node', modifier, 'modifier');

  //Keeping the functionality same as before for textnode
  if (['textnode', 'var', 'derived', 'data'].indexOf(node.type) > -1) {
    return node;
  }
  return Object.assign({}, node, {
    children: getChildren(node).map(child => {
      return modifier(child);
    })
  });
};

/**
 * @name filterChildren
 * @type {function}
 * @description
 * Function to pass in a filter function to the children.
 * @param {object} node AST node
 * @param {function} filter Filter function
 * @return {object} node with modified children
 */
const filterChildren = function(node, filter) {
  checkASTandFunction(node, 'node', filter, 'filter');

  if (['textnode', 'var', 'derived', 'data'].indexOf(node.type) > -1) {
    return node;
  }
  return Object.assign({}, node, {
    children: getChildren(node).filter(child => {
      return filter(child);
    })
  });
};

/**
 * @name modifyNodesByName
 * @description
 * Function to modfiy nodes based on the name property.
 * @param {object} ast
 * @param {string} name
 * @param {function} modifier
 * @return {object} ast
 */
const modifyNodesByName = function(ast, name, modifier) {
  typeCheckString(name, 'name');
  checkASTandFunction(ast, 'ast', modifier, 'modifier');

  const modifiedAST = [ast].map(node => {
    if (['textnode', 'var', 'derived', 'data'].indexOf(node.type) === -1) {
      node = Object.assign({}, node, {
        children: modifyHelper(getChildren(node), name.toLowerCase(), modifier)
      });
    }
    node = handleNodeByName(node, name, modifier);
    return node;
  });
  return modifiedAST[0];
};

//Helper function for modifyHelper.
function modifyHelper(children, name, modifier) {
  typeCheckString(name, 'name');
  //checkASTandFunction(, "ast", modifier, "modifier");

  return children.map(node => {
    if (['textnode', 'var', 'derived', 'data'].indexOf(node.type) === -1) {
      node = Object.assign({}, node, {
        children: modifyHelper(getChildren(node), name, modifier)
      });
    }
    node = handleNodeByName(node, name, modifier);
    return node;
  });
}

/**
 * @name handleNodeByName
 * @description
 * Function to modify a single node using a modifier and name property.
 * @param {Object} node
 * @param {string} name
 * @param {function} modifier
 * @return {object} if node.name = name then modifier(node), else node.
 */
const handleNodeByName = function(node, name, modifier) {
  typeCheckString(name, 'name');
  checkASTandFunction(node, 'node', modifier, 'modifier');

  if (['textnode', 'var', 'derived', 'data'].indexOf(node.type) > -1) {
    return Object.assign({}, node);
  }
  if (node.name && node.name.toLowerCase() === name) {
    node = modifier(Object.assign({}, node));
  }
  return Object.assign({}, node);
};

/**
 * @name getNodeName
 * @description
 * Function to get the name of a componenet
 * @param {object}  node
 * @return {string} name of the passed node
 */
const getNodeName = function(node) {
  typeCheckObject(node, 'node');
  //runValidator(node, "node");

  if (node.type !== 'component') {
    return node.type;
  }
  return node.name;
};
/**
 * @name getPropertyKeys
 * @description
 * Function to return a the list of property keys of a node
 * @param {object} node
 * @return {string[]} keys
 */
const getPropertyKeys = function(node) {
  typeCheckObject(node, 'node');
  runValidator(node, 'node');
  return Object.keys(node.properties);
};

/**
 * @name getProperty
 * @description
 * Getter function to a return a specific property of a node based on a key.
 * @param {object} node
 * @param {string} key
 * @return null, if the property does not exist, else property.data.
 */
const getProperty = function(node, key) {
  typeCheckString(key, 'key');
  typeCheckObject(node, 'node gp');
  runValidator(node, 'node');

  if (node.properties && node.properties.hasOwnProperty(key)) {
    return node.properties[key];
  }
  return null;
};

/**
 * @name getProperties
 * @description
 * Function to return all the properties of a given node.
 * @param {*} node
 * @return {object} properties of the node, or null if none exists,
 */
const getProperties = function(node) {
  typeCheckObject(node, 'node');
  runValidator(node, 'node');
  if (node.properties) {
    return node.properties;
  }
  return null;
};

/**
 * @name getPropertiesByType
 * @description
 * Function to get properties of a particular type of a given node.
 * @param {object} node
 * @param {string} type
 * @return {object[]} Array of properties if they exists, or an empty array of no properties of the given type exists.
 */
const getPropertiesByType = function(node, type) {
  checkType(type);
  typeCheckObject(node, 'node');
  runValidator(node, 'node');

  if (
    typeof type !== 'string' &&
    ['value', 'expression', 'variable'].indexOf(type) === -1
  ) {
    throw new error.InvalidParameterError(
      'Type should be a value, expression or variable'
    );
  }
  let res = [];
  if (node.properties) {
    for (let property in node.properties) {
      if (property.data.type === type) {
        res.push(property);
      }
    }
  }
  return res;
};

/**
 * @name prependNode
 * @description
 * Function to prepend a node in the children array of root.
 * @param {object} ast
 * @param {object} node
 * @return {object} modfied ast.
 */
const prependNode = function(ast, node) {
  checkASTandNode(ast, node);

  prependNodes(ast, [node]);
};

/**
 * @name prependNodes
 * @description
 * Function to prepend multiple nodes in the children array of root.
 * @param {object} ast
 * @param {object[]} nodes
 * @return {object} modfied ast.
 */
const prependNodes = function(ast, nodes) {
  checkASTandNodeArray(ast, nodes);

  return Object.assign({}, ast, {
    children: [].concat(nodes, getChildren(ast))
  });
};

/**
 * @name removeNodesByName
 * @description
 * Function remove node with a particular name from the ast
 * @param {*} ast
 * @param {*} name
 */
const removeNodesByName = function(ast, name) {
  typeCheckString(name, 'name');
  typeCheckObject(ast, 'ast');
  runValidator(ast, 'ast');

  if (hasChildren(ast)) {
    let children = getChildren(ast);
    ast = setChildren(ast, removeHelper(children, name));
  }
  return ast;
};

function removeHelper(children, name) {
  return children
    .filter(child => {
      if (getNodeName(child) === name) {
        return false;
      } else {
        return true;
      }
    })
    .map(child => {
      return setChildren(child, removeHelper(getChildren(child), name));
    });
}

/**
 * @name removeNodesByType
 * @description
 * Function remove node with a particular name from the ast
 * @param {*} ast
 * @param {*} type
 */
const removeNodesByType = function(ast, type) {
  typeCheckString(type, 'type');
  typeCheckObject(ast, 'ast');
  runValidator(ast, 'ast');

  if (hasChildren(ast)) {
    let children = getChildren(ast);
    ast = setChildren(ast, removeByTypeHelper(children, type));
  }
  return ast;
};

function removeByTypeHelper(children, type) {
  return children
    .filter(child => {
      if (getType(child) === type) {
        return false;
      } else {
        return true;
      }
    })
    .map(child => {
      return setChildren(child, removeByTypeHelper(getChildren(child), type));
    });
}
/**
 * @name removeProperties
 * @description
 * Function to remove a property from a node
 * @param {object} node
 * @param {string} key
 * @return {object} Modified node
 */
const removeProperty = function(node, key) {
  typeCheckString(key, 'key');
  typeCheckObject(node, 'node');
  runValidator(node, 'node');

  if (getProperties(node, key)) {
    const newNode = Object.assign({}, node);
    delete newNode.properties.key;
  }

  return newNode;
};

/* value ==> data */

/**
 * @name setProperty
 * @description
 * Function to add a property to a node or change the value if the property already exists.
 * @param {*} node
 * @param {*} name
 * @param {*} data
 * @return {object} Modfied Node
 */
const setProperty = function(node, name, data) {
  typeCheckString(key, 'key');
  typeCheckObject(data, 'data');
  typeCheckObject(node, 'node');
  runValidator(node, 'node');

  if (typeof node !== 'object') {
    throw new error.InvalidParameterError(
      'Parameter ast must be a well-defined JSON object.'
    );
  }
  if (validator(node)) {
    throw new error.MalformedAstError(
      'Parameter ast needs to be a JSON structure according to the schema.'
    );
  }
  if (typeof data !== 'object') {
    throw new error.InvalidParameterError(
      'Parameter data must be a well-defined JSON object.'
    );
  }
  if (typeof name !== 'string') {
    throw new error.InvalidParameterError('Parameter name must be a string.');
  }
  const newNode = Object.assign({}, node);
  if (newNode.properties) {
    newNode.properties[name] = data;
  }
  return newNode;
};

/**
 * @name setProperties
 * @description
 * Function to add multiple properties to a node
 * @param {object} node
 * @param {object} properties
 * @return {object} Modified node
 */
const setProperties = function(node, properties) {
  typeCheckObject(node, 'node');
  runValidator(node, 'node sp');
  checkProps(props);

  if (typeof porperties !== 'object') {
    throw new error.InvalidParameterError(
      'Parameter paramter must be a well-defined JSON object.'
    );
  }
  if (validatorProps(properties)) {
    throw new error.InvalidParameterError(
      'Paramete props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!'
    );
  }
  const newNode = Object.assign({}, node);
  if (newNode.properties) {
    newNode.properties = Object.assign({}, newNode.properties, properties);
  } else {
    newNode.properties = Object.assign({}, properties);
  }
  return newNode;
};

/**
 * @name walkNodes
 * @description
 * Function to do a depth-first traversal of the AST.
 * @param {object} ast  AST node
 * @param {function} f   callback function for each node.
 */
const walkNodes = function(ast, f) {
  checkASTandFunction(ast, 'ast', f, 'f');
  walkNodesHelper(ast.children, f);
  f(ast);
};

//Helper function for walkNodes
function walkNodesHelper(astArray, f) {
  (astArray || []).forEach(node => {
    let children = getChildren(node);
    if (children.length > 0) {
      walkNodesHelper(children, f);
    }
    f(node);
  });
}

/**
 * @name walkNodeBreadthFirst
 * @description
 * Function to breadth-first traversal on the AST.
 * @param {object} ast
 * @param {function} f
 */
const walkNodesBreadthFirst = function(ast, f) {
  checkASTandFunction(ast, 'ast', f, 'f');
  f(ast);
  walkNodesBreadthFirstHelper(ast, f);
};

// Helper function for walkNodeBreadthFirst
function walkNodesBreadthFirstHelper(ast, f) {
  let childAst = [];
  (ast || []).forEach(node => {
    f(node);
    childAst = childAst.concat(getChildren(node));
  });
  if (childAst.length > 0) {
    walkNodesBreadthFirstHelper(childAst, f);
  }
}

/*
  Function to check for errors between ast and node variables
*/
function checkASTandNode(ast, node) {
  typeCheckObject(ast, 'ast');
  typeCheckObject(node, 'node');
  runValidator(ast, 'ast');
  runValidator(node, 'node');
}

/*
  Function to check for errors between ast and an array of nodes
*/
function checkASTandNodeArray(ast, nodes) {
  typeCheckObject(ast, 'ast');
  typeCheckArray(nodes, 'nodes');
  nodes.forEach((node, index) => {
    typeCheckObject(node, 'nodes (index: ' + index + ')');
  });
  runValidator(ast, 'ast');
  nodes.forEach((node, index) => {
    runValidator(node, 'nodes (index: ' + index + ')');
  });
}

/*
  Function to check for errors while creating a new Node
*/
function checkForCreateNode(id, name, type, props, children) {
  typeCheckInteger(id, 'id');
  typeCheckString(name, 'name');
  checkNodeType(type);
  checkProps(props);
  checkChildren(children);
}

/*
  Function to type-check for objects
*/
function typeCheckObject(param, paramName) {
  if (typeof param !== 'object') {
    throw new error.InvalidParameterError(
      'Parameter ' +
        paramName +
        ' must be a well defined JSON object. ' +
        'Object: ' +
        param
    );
  }
}

/*
  Function to type check Integers
*/
function typeCheckInteger(param, paramName) {
  if (typeof param !== 'number') {
    throw new error.InvalidParameterError(
      'Paramter: ' + paramName + 'must be an integer.'
    );
  }
}

/*
  Function to type check strings
*/
function typeCheckString(param, paramName) {
  if (typeof param !== 'string') {
    throw new error.InvalidParameterError(
      'Parameter' + param + 'must be a string.'
    );
  }
}

/*
  Function to type check an array
*/
function typeCheckArray(array, arrayName) {
  if (!Array.isArray(array)) {
    throw new InvalidParameterError(
      'Paramter ' + arrayName + ' must be an array. ' + 'Object: ' + param
    );
  }
}

function typeCheckFunction(func, name) {
  if (typeof func !== 'function') {
    throw new InvalidParameterError(
      'Paramter ' + name + ' must be a Function. ' + 'Function: ' + func
    );
  }
}
/*
  Function to type check a function
*/
function checkASTandFunction(ast, astName, func, functionName) {
  typeCheckObject(ast, astName);
  typeCheckFunction(func, functionName);
  runValidator(ast, astName);
}

/*
 Function to check the type of a AST node
*/
function checkType(type) {
  typeCheckString(type, 'type');
  if (['value', 'expression', 'variable'].indexOf(type) === -1) {
    throw new error.InvalidParameterError(
      'Type should be a value, expression or variable'
    );
  }
}

/*
 Function to check type of a component
*/
function checkNodeType(type) {
  typeCheckString(type, 'type');
  if (
    ['component', 'textnode', 'var', 'derived', 'data'].indexOf(type) === -1
  ) {
    throw new error.InvalidParameterError(
      'Type should be a component, textnode, var, derived or data'
    );
  }
}
/*
  Function to check and validate properties paramter for a node
*/
function checkProps(props) {
  if (props) {
    typeCheckObject(props, 'props (Properties)');
    runPropsValidator(props);
  }
}

function checkChildren(children) {
  if (children) {
    typeCheckArray(children, 'children');
    children.forEach((child, index) => {
      typeCheckObject(child, 'children (index: ' + index + ')');
    });
    children.forEach((child, index) => {
      runValidator(child, 'children (index: ' + index + ')');
    });
  }
}

/*
  Function to validate AST structures
*/
function runValidator(param, paramName) {
  if (!validator(param)) {
    console.log('Error message from validator: ' + validator.errors[0].message);
    console.log('Error message from validator: ', validator.errors[0]);
    throw new error.MalformedAstError(
      paramName +
        ' must be well-defined and follow the AST schema. ' +
        'Object: ' +
        JSON.stringify(param)
    );
  }
}

/*
  Function to validate Properties for an AST structures.
*/
function runPropsValidator(props) {
  if (!validatorProps(props)) {
    console.log(
      'Error message from validator: ' + validatorProps.errors[0].message
    );
    console.log('Error message from validator: ', validatorProps.errors[0]);
    throw new error.InvalidParameterError(
      'Parameter props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!'
    );
  }
}

function propertyToString(property) {
  switch (property.type) {
    case 'value':
      return JSON.stringify(property.value);
    case 'expression':
      return `\`${property.value}\``;
    case 'variable':
      return property.value;
  }
}

function propertiesToString(node, depth, insertFullWidth) {
  const props = { ...node.properties };
  if (
    insertFullWidth &&
    node.type === 'component' &&
    node.name.toLowerCase() !== 'textcontainer'
  ) {
    props.fullWidth = { type: 'value', value: true };
  }
  let flatString = Object.keys(props || {}).reduce(function(memo, key) {
    return memo + ` ${key}:${propertyToString(props[key])}`;
  }, '');

  if (flatString.length < 60) {
    return flatString;
  }

  return Object.keys(props || {}).reduce(function(memo, key) {
    return (
      memo + `\n${'  '.repeat(depth + 1)}${key}:${propertyToString(props[key])}`
    );
  }, '');
}

function childrenToMarkup(
  node,
  depth,
  separator = '\n',
  insertFullWidth = false
) {
  return (node.children || [])
    .reduce(function(memo, child) {
      return (
        memo +
        `${separator}${nodeToMarkup(child, depth, insertFullWidth, separator)}`
      );
    }, '')
    .replace(/\n\n+/g, '\n\n');
}

function nodeToMarkup(node, depth, insertFullWidth, separator = '\n') {
  if (
    node.name &&
    node.name.toLowerCase() === 'IdyllEditorDropTarget'.toLowerCase()
  ) {
    return '';
  }

  const markupNodes = [
    'strong',
    'em',
    'i',
    'b',
    'code',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'a'
  ];

  // normalize component names
  if (node.name && !htmlTags.includes(node.name.toLowerCase())) {
    node.name = node.name
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  }

  switch (node.type) {
    case 'textnode':
      return `${'  '.repeat(depth)}${node.value.trim()}`;
    case 'component':
      if (node.name.toLowerCase() === 'textcontainer') {
        return `\n${childrenToMarkup(node, depth, '\n', false)}`;
      } else if (node.name.toLowerCase() === 'p' && depth < 1) {
        return `\n${childrenToMarkup(node, depth, '\n', false).trim()}\n`;
      } else if (markupNodes.includes(node.name.toLowerCase())) {
        switch (node.name.toLowerCase()) {
          case 'strong':
          case 'b':
            return `**${childrenToMarkup(node, 0, ' ', false).trim()}**`;
          case 'em':
          case 'i':
            return `*${childrenToMarkup(node, 0, ' ', false).trim()}*`;
          case 'code':
            return `\`${childrenToMarkup(node, 0, ' ', false).trim()}\``;
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
            if (
              node.children &&
              node.children.length === 1 &&
              node.children[0].type === 'textnode'
            ) {
              return `${'#'.repeat(+node.name[1])} ${childrenToMarkup(
                node,
                0,
                ' ',
                false
              ).trim()}`;
            }
        }
      }

      if (
        node.name.toLowerCase() === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].name &&
        node.children[0].name.toLowerCase() === 'code'
      ) {
        return `
\`\`\`
${childrenToMarkup(node.children[0], 0, ' ', false).trim()}
\`\`\`
        `;
      } else if (
        node.name.toLowerCase() === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].type === 'textnode'
      ) {
        return `
\`\`\`
${childrenToMarkup(node, 0, ' ', false).trim()}
\`\`\``;
      }

      const propString = propertiesToString(node, depth, insertFullWidth);
      if (hasChildren(node)) {
        if (node.name === 'a') {
          return `${'  '.repeat(depth)}[${node.name}${
            propString ? `${propString}` : ''
          }]${childrenToMarkup(node, depth + 1, ' ', false).trim()}[/${
            node.name
          }]`;
        }
        return `${'  '.repeat(depth)}[${node.name}${
          propString ? `${propString}` : ''
        }]${childrenToMarkup(node, depth + 1, separator, false)}\n${'  '.repeat(
          depth
        )}[/${node.name}]`;
      }
      return `${'  '.repeat(depth)}[${node.name}${
        propString ? `${propString}` : ''
      } /]`;
    case 'var':
    case 'derived':
    case 'data':
    case 'meta':
      return `${'  '.repeat(depth)}[${node.type}${propertiesToString(
        node,
        depth,
        insertFullWidth
      )} /]`;
  }
}

/**
 * @name toMarkup
 * @description
 * Function to convert AST back to idyll markup
 * @param {object} ast  AST node
 * @return {string} Markup string
 */
function toMarkup(ast, options = { insertFullWidth: false }) {
  const markup = childrenToMarkup(
    ast,
    0,
    ast.name === 'p' ? ' ' : '\n',
    options.insertFullWidth || false
  ).trim();

  const cleanedMarkup = markup.replace(/([\]\*\_]) ([,\.\!\?\:\[])/g, '$1$2');

  return cleanedMarkup;
}

module.exports = {
  appendNode,
  appendNodes,
  converters,
  createNode,
  createTextNode,
  filterChildren,
  filterNodes,
  getChildren,
  getNodesByName,
  getNodesByType,
  getNodeName,
  getPropertyKeys,
  getProperty,
  getProperties,
  getPropertiesByType,
  getText,
  hasType,
  getType,
  hasChildren,
  modifyChildren,
  modifyNodesByName,
  prependNode,
  prependNodes,
  removeNodesByName,
  removeNodesByType,
  removeProperty,
  setChildren,
  setProperty,
  setProperties,
  walkNodes,
  walkNodesBreadthFirst,
  toMarkup
};
