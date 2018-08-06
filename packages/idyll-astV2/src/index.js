/**
 * @module idyll-astV2 
 * @description
 * This file contains utility functions for the Idyll-Ast libraray. 
 * The structure and schema of the json can be found in the file ast.schema.json in 
 * the package idyll-astV2. 
 */

const { convert, inverseConvert } = require('./converters/converters'); 
const error = require('./error');
const Ajv = require("ajv");
const ajv = new Ajv();
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
const schema = require('./ast.schema.json');
const validator = ajv.compile(schema);
const ajvProps = new Ajv();
const validatorProps = ajv.compile(schema.properties.properties);

/**
 * @name appendNode
 * @type {function}
 * @description
 * Function to append a top-level child to the root element. 
 * @param {object} ast   JSON-object 
 * @param {object} node  JSON-object 
 * @return {object} Modifed ast node 
 */
const appendNode = function (ast, node) {
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
const appendNodes = function (ast, nodes) {
  checkASTandNodeArray(ast, nodes);
  ast.children = ([]).concat(ast.children, nodes);
  return Object.assign({}, ast);
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
const createNode = function (id, name, type, props = null, children = null) {
  checkForCreateNode(id, name, type, props, children);

  let node = new Object();
  node.id = id;
  node.type = type;
  node.name = name;
  if (props) {
    node.props = object.assign({}, props);
  }
  if (children) {
    node.children = object.assign({}, children);
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
const createTextNode = function (id, value) {
  typeCheckInteger(id, "id");
  typeCheckString(value, "value");

  let texnode = new Object();
  textnode.id = id;
  textnode.type = "textnode";
  textNode.value = value;

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
const getChildren = function (node) {
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (node.type === "textnode") {
    return [];
  }
  if(node.children) {
    return node.children.map((element) => Object.assign({}, element));
  } else {
    return []; 
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
const getNodesByName = function (ast, name) {
  typeCheckObject(ast, "ast");
  typeCheckString(name, "name");
  runValidator(ast, "ast");

  let node = ast.children.filter((element) => (element.name === name));
  node = node.map((element) => Object.assign({}, element));

  let otherNodes = [];
  node.forEach((node) => {
    othernodes += getNodesByName(node, name);
  });
  return (node.concat(otherNodes)).map((element => Object.assign({}, element)));
};

/**
 * @name getText 
 * @type {function}
 * @description 
 * Function to get all the text from textnodes from the passes AST node
 * @param {object} ast AST node 
 * @return {string}
 */
const getText = function (node) {
  typeCheckObject(node, "node");
  runValidator(node, "node");

  const texts = [];
  walknodes(getChildren(node), (n) => {
    if (n.type === "textnode") {
      texts.push(n);
    }
  });
  return texts.join("");
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
const filterNodes = function (ast, filter) {
  checkASTandFunction(ast, "ast", filter, "filter");

  let result = [];
  walkNodes(ast, node => {
    if (filter(node)) result.push(node);
  });
  return result.map((element => Object.assign({}, element)));
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
const modifyChildren = function (node, modifier) {
  checkASTandFunction(node, "node", modifier, "modifier");

  //Keeping the functionality same as before for textnode
  if (node.type === "textnode") {
    return node;
  }
  node.children = getChildren(node).map((child) => {
    return modifier(child);
  });
  return Object.assign({}, node);
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
const filterChildren = function (node, filter) {
  checkASTandFunction(node, "node", filter, "filter");

  if (node.type === "textnode") {
    return node;
  }
  node.children = getChildren(node).filter((child) => {
    return filter(child);
  });
  return Object.assign({}, node);
};

/**
 * @name pruneNodes
 * @type {function}
 * @description
 * Function to prune nodes based on a filter and return a modified AST. 
 * @param {object} ast 
 * @param {functon} filter 
 * @return {object[]} An array with the ModifiedAST as it's 0th index.
 */
const pruneNodes = function (ast, filter) {
  checkASTandFunction(ast, "ast", filter, "filter");

  let result = [ast].filter(filter).map((node) => {
    if (node.type === "textnode") {
      return node;
    }
    node.children = pruneNodes(getChildren(node) || [], filter);
    return Object.assign({}, node);
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
const modifyNodesByName = function (ast, name, modifier) {
  typeCheckString(name, "name");
  checkASTandFunction(ast, "ast", modifier, "modifier");

  ([ast] || []).map((node) => {
    modifyHelper(getChildren(node), name, modifier);
    node = handleNodeByName();
  });
  return Object.assign({}, ast);
};

//Helper function for modifyHelper. 
function modifyHelper(ast, name, modifier) {
  typeCheckString(name, "name");
  checkASTandFunction(ast, "ast", modifier, "modifier");

  ([ast] || []).map((node) => {
    modifyHelper(getChildren(node, name, modifier));
    node = handleNodeByName(node);
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
const handleNodeByName = function (node, name, modifier) {
  typeCheckString(name, "name");
  checkASTandFunction(node, "node", modifier, "modifier");

  if (node.type === "textnode") {
    return node;
  }
  if (node.name.toLowerCase() === name) {
    node = modifier(node);
  }
  return node;
}

/**
 * @name getNodeName
 * @description 
 * Function to get the name of a componenet
 * @param {object}  node
 * @return {string} name of the passed node
 */
const getNodeName = function (node) {
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (node.type !== "compoenent") {
    throw error.InvalidParameterError("Paramter node must be a component");
  }
  return node.name;
};

/**
 * @name getProperty
 * @description
 * Getter function to a return a specific property of a node based on a key. 
 * @param {object} node 
 * @param {string} key 
 * @return null, if the property does not exist, else property.data. 
 */
const getProperty = function (node, key) {
  typeCheckString(key, "key");
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (node.properties.hasOwnProperty(key)) {
    return node.properties[key]; 
  }
  return null
};

/**
 * @name getProperties 
 * @description 
 * Function to return all the properties of a given node. 
 * @param {*} node 
 * @return {object} properties of the node, or null if none exists, 
 */
const getProperties = function (node) {
  typeCheckObject(node, "node");
  runValidator(node, "node");

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
const getPropertiesByType = function (node, type) {
  checkType(type);
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (typeof type !== "string" && (["value", "expression", "variable"].indexOf(type) === -1)) {
    throw new error.InvalidParameterError("Type should be a value, expression or variable");
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
const prependNode = function (ast, node) {
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
const prependNodes = function (ast, nodes) {
  checkASTandNodeArray(ast, nodes);

  ast.children = ([]).concat(nodes, getChildren(ast));
  return Object.assign({}, ast);
};

/**
 * @name removeNodesByName 
 * @description
 * Function remove node with a particular name from the ast
 * @param {*} ast 
 * @param {*} name 
 */
const removeNodesByName = function (ast, name) {
  typeCheckString(name, "name");
  typeCheckObject(ast, "ast");
  runValidator(ast, "ast");
  return pruneNodes(ast, (node) => {
    if (node.name.toLowerCase() === name.toLowerCase()) {
      return false;
    }
    return true;
  })
};

/**
 * @name removeProperties
 * @description
 * Function to remove a property from a node
 * @param {object} node 
 * @param {string} key 
 * @return {object} Modified node
 */
const removeProperty = function (node, key) {
  typeCheckString(key, "key");
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (getProperties(node, key)) {
    delete node.key;
  }
  return Object.assign({}, node);
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
const setProperty = function (node, name, data) {
  typeCheckString(key, "key");
  typeCheckObject(data, "data");
  typeCheckObject(node, "node");
  runValidator(node, "node");

  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  if (typeof data !== "object") {
    throw new error.InvalidParameterError("Parameter data must be a well-defined JSON object.");
  }
  if (typeof name !== "string") {
    throw new error.InvalidParameterError("Parameter name must be a string.");
  }
  if (node.properties) {
      node.properties[name] = data; 
    }
  } 
  return Object.assign({}, node);
};

/**
 * @name setProperties 
 * @description
 * Function to add multiple properties to a node
 * @param {object} node
 * @param {object} properties 
 * @return {object} Modified node 
 */
const setProperties = function (node, properties) {
  typeCheckObject(node, "node");
  runValidator(node, "node");
  checkProps(props);

  if (typeof porperties !== "object") {
    throw new error.InvalidParameterError("Parameter paramter must be a well-defined JSON object.");
  }
  if (validatorProps(properties)) {
    throw new error.InvalidParameterError("Paramete props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!");
  }
  if (node.properties) {
    node.properties = Object.assign({}, node.properties, properties);
  } else {
    node.properties = Object.assign({}, porperties);
  }
  return Object.assign({}, node);
};

/**
 * @name walkNodes
 * @description 
 * Function to do a depth-first traversal of the AST. 
 * @param {object} ast  AST node 
 * @param {function} f   callback function for each node. 
 */
const walkNodes = function (ast, f) {
  checkASTandFunction(ast, "ast", f, "f");

  walkNodesHelper(ast, f);
};

//Helper function for walkNodes 
function walkNodesHelper(ast, f) {
  ([ast] || []).forEach((node) => {
    let child = getChildren(node);
    if(child.length > 0) {
      walkNodes(child, f);
      f(node);
    }
  });
}

/**
 * @name walkNodeBreadthFirst
 * @description
 * Function to breadth-first traversal on the AST. 
 * @param {object} ast 
 * @param {function} f 
 */
const walkNodesBreadthFirst = function (ast, f) {
  checkASTandFunction(ast, "ast", f, "f");
  walkNodesBreadthFirstHelper(ast, f);
};

// Helper function for walkNodeBreadthFirst
function walkNodesBreadthFirstHelper(ast, f) {
  let childAst = [];
  ([ast] || []).forEach((node) => {
    f(node);
    childAst = childAst.concat(getChildren(node));
  });
  if (childAst.length !== 0) {
    walkNodesBreadthFirst(childAst, f);
  }
}

const addRoot = function(ast) {
  let root = {
    "id": 1,
    "name": "root", 
    "type": "compoenent", 
    "children": ast
  }
  return root; 
}
/*
  Function to check for errors between ast and node variables
*/
function checkASTandNode(ast, node) {
  typeCheckObject(ast, "ast");
  typeCheckObject(node, "node");
  runValidator(ast, "ast");
  runValidator(node, "node");
}

/*
  Function to check for errors between ast and an array of nodes
*/
function checkASTandNodeArray(ast, nodes) {
  typeCheckObject(ast, "ast");
  typeCheckArray(nodes, "nodes");
  nodes.forEach((node, index) => {
    typeCheckObject(node, "nodes (index: " + index + ")");
  });
  runValidator(ast, "ast");
  nodes.forEach((node, index) => {
    runValidator(node, "nodes (index: " + index + ")");
  });
}

/*
  Function to check for errors while creating a new Node
*/
function checkForCreateNode(id, name, type, props, children) {
  typeCheckInteger(id);
  typeCheckString(name);
  checkType(type);
  checkProps(props);
  checkChildren(children);
}

/*
  Function to type-check for objects
*/
function typeCheckObject(param, paramName) {
  if (typeof param !== "object") {
    throw new error.InvalidParameterError("Parameter " + paramName + " must be a well defined JSON object. " + "Object: " + param);
  }
}

/* 
  Function to type check Integers
*/
function typeCheckInteger(param, paramName) {
  if (typeof parma !== "integer") {
    throw new error.InvalidParameterError("Paramter: " + paramName + "must be an integer.");
  }
}

/*
  Function to type check strings
*/
function typeCheckString(param, paramName) {
  if (typeof param !== "string") {
    throw new error.InvalidParameterError("Parameter" + param + "must be a string.");
  }
}

/*
  Function to type check an array
*/
function typeCheckArray(array, arrayName) {
  if (!array.isArray()) {
    throw new InvalidParameterError("Paramter " + arrayName + " must be an array. " + "Object: " + param);
  }
}

function typeCheckFunction(func, name) {
  if(typeof func !== "function") {
    throw new InvalidParameterError("Paramter " + name + " must be a Function. " + "Function: " + func);
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
  typeCheckString(type, "type");
  if ((["value", "expression", "variable"].indexOf(type) === -1)) {
    throw new error.InvalidParameterError("Type should be a value, expression or variable");
  }
}
/*
  Function to check and validate properties paramter for a node
*/
function checkProps(props) {
  if (props) {
    typeCheckObject(props, "props (Properties)");
    runPropsValidator(props);
  }
}

function checkChildren(children) {
  if (children) {
    typeCheckArray(children, "children");
    children.forEach((child, index) => {
      typeCheckObject(child, "children (index: " + index + ")");
    });
    children.forEach((child, index) => {
      runValidator(child, "children (index: " + index + ")");
    });
  }
}

/*
  Function to validate AST structures
*/
function runValidator(param, paramName) { 
 /* if (!validator(param)) {
    console.log("Error message from validator: " + validator.errors[0].message);
    console.log(param);
    throw new error.MalformedAstError(paramName + " must be well-defined and follow the AST schema. " + "Object: " + param);
  }*/
}

/*
  Function to validate Properties for an AST structures. 
*/
function runPropsValidator(props) {
  if (!validatorProps(props)) {
    console.log("Error message from validator: " + validatorProps.error[0].message);
    throw new error.InvalidParameterError("Parameter props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!");
  }
}




module.exports = {
  appendNode,
  appendNodes,
  createNode,
  createTextNode,
  filterChildren,
  filterNodes,
  getChildren,
  getNodesByName,
  getNodeName,
  getProperty,
  getProperties,
  getPropertiesByType,
  getText,
  modifyChildren,
  modifyNodesByName,
  prependNode,
  prependNodes,
  pruneNodes,
  removeNodesByName,
  removeProperty,
  setProperty,
  setProperties,
  walkNodes,
  walkNodesBreadthFirst,
  convert, 
  inverseConvert, 
  addRoot
};