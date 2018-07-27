/**
 * @module idyll-astV2 
 * @description
 * This file contains utility functions for the Idyll-Ast libraray. 
 * The structure and schema of the json can be found in the file ast.schema.json in 
 * the package idyll-astV2. 
 */

const error = require('./error'); 
const Ajv = require("ajv");
const ajv = new Ajv();
const schema = require("../ast.schema.json");
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (!validator(ast)) {
    console.log("Error message from validator: " + validator.errors[0].message);
    throw new error.MalformedAstError("Ast must be well-defined and follow the AST schema.");
  }
  if (!validator(node)) {
    throw new error.MalformedAstError("Passed node must be well-deinfed and follow the AST schema.");
  }
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (!nodes.isArray()) {
    throw new error.InvalidParameterError("Parameter nodes must be an array of node/children following the AST schema.");
  }
  if (!validator(ast)) {
    throw new error.MalformedAstError("Ast must be well-deinfed and follow the AST schema.");
  }
  nodes.foreach((element) => {
    if (!validator(element)) {
      throw new error.MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in nodes.");
    }
  });
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
  if (typeof id !== "integer") {
    throw new error.InvalidParameterError("Paramter id must be an integer. ")
  }
  if (typeof name !== "string") {
    throw new error.InvalidParameterError("Parameter name must be a string.");
  }
  if (typeof type != "string") {
    throw new error.InvalidParameterError("Parameter type must be a string.");
  }

  if (type === "component") {
    if ((["value", "variable", "expression"]).indexOf(value) === -1) {
      throw new error.InvalidParameterError("Value can only be value, expression or variable.");
    }
  }

  if (props) {
    if (typeof props !== "object") {
      throw new error.InvalidParameterError("Parameter props must be a Map of properties (name-data pair objects) of a node.");
    }
    if (validatorProps(props)) {
      throw new error.InvalidParameterError("Paramete props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!");
    };
  }
  if (children) {
    if (!children.isArray()) {
      throw new error.InvalidParameterError("Parameter children must be an array of node/children following the AST schema.");
    }
    children.foreach((element) => {
      if (!validator(element)) {
        throw new error.MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in children.");
      }
    });
  }

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
  if (typeof id !== "integer") {
    throw new error.InvalidParameterError("Paramter id should be of type integer");
  }
  if (typeof value !== "string") {
    throw new error.InvalidParameterError("Paramter value should be of type string");
  }
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (!validator(node)) {
    throw new error.MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema.");
  }
  if (node.type === "textnode") {
    return [];
  }
  return node.children.map((element) => Object.assign({}, element));
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof name !== "string") {
    throw new error.InvalidParameterError("Parameter name must be a string");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema.");
  }
  let node = ast.children.filter((element) => (element.name === name));
  node = node.map((element) => Object.assign({}, element));

  let otherNodes = [];
  ast.foreach((node) => {
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema.");
  }
  const texts = [];
  walknodes(getChildren(node), (n) => {
    if (typeof n === "string") {
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof filter !== "function") {
    throw new error.InvalidParameterError("Parameter filter must be a function.");
  }
  if (validate(ast)) {
    throw new error.MalformedAstError("Passed ast must be a well-defined JSON object and must follow the AST schema.");
  }
  let result = [];
  walknodes(ast, node => {
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (typeof modifier !== "function") {
    throw new error.InvalidParameterError("Parameter modifier needs to be a function.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (typeof filter !== "function") {
    throw new error.InvalidParameterError("Parameter modifier needs to be a function.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (typeof filter !== "function") {
    throw new error.InvalidParameterError("Parameter filter needs to be a function.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (typeof name !== "object") {
    throw new error.InvalidParameterError("Paramter name must be a string.");
  }
  if (typeof modifier !== "function") {
    throw new error.InvalidParameterError("Parameter filter needs to be a function.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  ([ast] || []).map((node) => {
    modifyHelper(getChildren(node), name, modifier);
    node = handleNodeByName();
  });
  return Object.assign({}, ast);
};

//Helper function for modifyHelper. 
function modifyHelper(ast, name, modifier) {
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
const getNodeName = function(node) {
  if(node.type !== "compoenent") {
    throw error.InvalidParameterError("PAramter node must be a component"); 
  }
  return node.name;
}; 

/**
 * @name getProperty
 * @description
 * Getter function to a return a specific property of a node based on a key. 
 * @param {*} node 
 * @param {*} key 
 * @return null, if the property does not exist, else property.data. 
 */
const getProperty = function (node, key) {
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (typeof key !== "string") {
    throw new error.InvalidParameterError("Parameter key must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  if (node.properties) {
    return node.properties.foreach((prop) => {
      if (prop.name === key) {
        return prop.data;
      }
    });
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
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
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  if (!nodes.isArray()) {
    throw new error.InvalidParameterError("Parameter nodes must be an array of node/children following the AST schema.");
  }
  nodes.foreach((element) => {
    if (!validator(element)) {
      throw new error.MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in nodes.");
    }
  });

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
    if (node.properties.hasOwnProperty(name)) {
      node.properties.name = data;
    } else {
      node.properties = Object.assign({
        name: data
      }, getProperties(node));
    }

  } else {
    node.properties = Object.assign({
      name: data
    }, {});
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
  if (typeof node !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (validator(node)) {
    throw new error.MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
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
 * @type {function}
 * @description 
 * Function to do a depth-first traversal of the AST. 
 * @param {object} ast  AST node 
 * @param {function} f   callback function for each node. 
 */
const walkNodes = function (ast, f) {
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof f !== "function") {
    throw new error.InvalidParameterError("Parameter f must be a function.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Passed ast must be a well-defined JSON object and must follow the AST schema.");
  }
  walkNodesHelper(ast, f);
};

//Helper function for walkNodes 
function walkNodesHelper(ast, f) {
  ([ast] || []).foreach((node) => {
    walkNodes(getChildren(node), f);
    f(node);
  });
}

const walkNodesBreadthFirst = function (ast, f) {
  if (typeof ast !== "object") {
    throw new error.InvalidParameterError("Parameter ast must be a well-defined JSON object.");
  }
  if (typeof f !== "function") {
    throw new error.InvalidParameterError("Parameter f must be a function.");
  }
  if (validator(ast)) {
    throw new error.MalformedAstError("Passed ast must be a well-defined JSON object and must follow the AST schema.");
  }
  walkNodesBreadthFirstHelper();
};

function walkNodesBreadthFirstHelper() {
  let childAst = [];
  ([ast] || []).forEach((node) => {
    f(node);
    childAst = childAst.concat(getChildren(node));
  });
  if (childAst.length !== 0) {
    walkNodesBreadthFirst(childAst, f);
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
  walkNodesBreadthFirst
};