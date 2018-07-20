/**
 * @module idyll-astV2 
 * @description
 * This file contains utility functions for the Idyll-Ast libraray. 
 * The structure and schema of the json can be found in the file ast.schema.json in 
 * the package idyll-astV2. 
 */


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
const appendNode = function(ast, node) { 
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(!validator(ast)) {
    throw new MalformedAstError("Ast must be well-deinfed and follow the AST schema."); 
  }
  if(!validator(node)) {
    throw new MalformedAstError("Passed node must be well-deinfed and follow the AST schema."); 
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
const appendNodes = function(ast, nodes) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(!validator(ast)) {
    throw new MalformedAstError("Ast must be well-deinfed and follow the AST schema."); 
  }
  if(!nodes.isArray()) {
    throw new InvalidParameterError("Parameter nodes must be an array of node/children following the AST schema."); 
  }
  nodes.foreach((element) => {
    if(!validator(element)) {
      throw new MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in nodes."); 
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
 * @return {object} New AST node. 
 */
const createNode = function(id, name, type, value, props, children) {
  if(typeof id !== "integer") {
    throw new InvalidParameterError("Paramter id must be an integer. ")
  }
  if(typeof name !== "string") {
    throw new InvalidParameterError("Parameter name must be a string."); 
  }
  if(typeof type != "string") {
    throw new InvalidParameterError("Parameter type must be a string."); 
  }

  if(typeof value !== "string") {
    throw new InvalidParameterError("Paramter value must be a string."); 
  }
  if(type === "component") {
    if((["value", "variable", "expression"]).indexOf(value) === -1) {
      throw new InvalidParameterError("Value can only be value, expression or variable."); 
    }
  }
  if(props) {
    if(!props.isArray()) {
      throw new InvalidParameterError("Parameter props must be an array of properties (name-value pair objects) of a node."); 
    }
    if(validatorProps(props)) {
      throw new InvalidParameterError("Paramete props is not a well-defined JSON according to the the AST schema. Look at schema.properties.properties!") 
    }; 
  }
  if(children) {
    if(!children.isArray()){
      throw new InvalidParameterError("Parameter children must be an array of node/children following the AST schema.");
    }
    children.foreach((element) => {
      if(!validator(element)) {
        throw new MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in children."); 
      }
    }); 
  }

  let node  = new Object(); 
  node.id = id; 
  node.type = type; 
  node.name = name; 
  node.value = value; 
  if(props) {
    node.props = object.assign({}, props); 
  }
  if(children) {
    node.children = object.assign({}, children); 
  }
  return node; 
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
  if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(!validator(node)) {
    throw new MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema."); 
  }
  if(node.type === "textnode") {
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
const getNodesByName = function(ast, name) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(typeof name !== "string") {
    throw new InvalidParameterError("Parameter name must be a string");
  }
  if(validator(ast)) {
    throw new MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema."); 
  }
  let node = ast.children.filter((element) => (element.name === name));
  node =  node.map((element) => Object.assign({}, element));
  
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

 const getText = function(node) {
   if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
   }
   if(validator(node)) {
    throw new MalformedAstError("Passed node must be a well-defined JSON object and must follow the AST schema."); 
   }
   const texts = []; 
   walknodes(getChildren(node), (n) => {
     if(typeof n === "string") {
       texts.push(n); 
     }
   }); 
   return texts.join(""); 
 };  
 /**
  * @name walkNodes
  * @type {function}
  * @description 
  * Function to do a depth-first traversal of the AST. 
  * @param {object} ast  AST node 
  * @param {function} f   callback function for each node. 
  */
const walkNodes = function(ast, f) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(typeof f !== "function") {
      throw new InvalidParameterError("Parameter f must be a function."); 
  }
  if(validator(ast)) {
    throw new MalformedAstError("Passed ast must be a well-defined JSON object and must follow the AST schema."); 
  }
  walkNodesHelper(ast, f); 
}; 

//Helper function for walkNodes 
function walkNodesHelper(ast, f){
  ([ast] || []).foreach((node) => {
    walkNodes(getChildren(node), f); 
    f(node); 
  }); 
}

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
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  } 
  if(typeof filter !== "function") {
      throw new InvalidParameterError("Parameter filter must be a function."); 
  }
  if(validate(ast)) {
    throw new MalformedAstError("Passed ast must be a well-defined JSON object and must follow the AST schema."); 
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
const modifyChildren = function(node, modifier) {
  if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(typeof modifier !== "function") {
    throw new InvalidParameterError("Parameter modifier needs to be a function."); 
  }
  if(validator(node)) {
    throw new MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  //Keeping the functionality same as before for textnode
  if(node.type === "textnode") {
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
const filterChildren = function(node, filter) {
  if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(typeof filter !== "function") {
    throw new InvalidParameterError("Parameter modifier needs to be a function."); 
  }
  if(validator(node)) {
    throw new MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  if(node.type === "textnode") {
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
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(typeof filter !== "function") {
    throw new InvalidParameterError("Parameter filter needs to be a function."); 
  }
  if(validator(ast)) {
    throw new MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  let result = [ast].filter(filter).map((node) => {
    if(node.type === "textnode") {
      return node; 
    }
    node.children = pruneNodes(getChildren(node) || [], filter); 
    return Object.assign({}, node); 
  }); 
}; 

/*
  question
*/
/**
 * 
 * @param {*} ast 
 * @param {*} name 
 * @param {*} modifier 
 */
const modifyNodesByName = function(ast, name, modifier) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(typeof name !== "object") {
    throw new InvalidParameterError("Paramter name must be a string."); 
  }
  if(typeof modifier !== "function") {
    throw new InvalidParameterError("Parameter filter needs to be a function."); 
  }
  if(validator(ast)) {
    throw new MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
}; 

/**
 * 
 * @param {*} node 
 * @param {*} key 
 */
const getProperty = function(node, key) {
  if(typeof node !==  "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(typeof key !== "string") {
    throw new InvalidParameterError("Parameter key must be a well-defined JSON object.");
  }
  if(validator(node)) {
    throw new MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  if(node.properties) {
    node.properties.foreach((prop) => {
      if(prop.name === key) {
        return prop.value; 
      }
    });
  }
  return null
}; 

/**
 * 
 * @param {*} node 
 */
const getProperties = function(node) {
  if(typeof node !==  "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object."); 
  }
  if(validator(node)) {
    throw new MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  if(node.properties) {
    return node.properties; 
  }
  return []; 
}; 
/**
 * 
 * @param {*} node 
 * @param {*} type 
 */
const getPropertiesByType = function(node, type) {

}; 

/**
 * 
 * @param {*} ast 
 * @param {*} node 
 */
const prependNode = function(ast, node) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(typeof node !== "object") {
    throw new InvalidParameterError("Parameter node must be a well-defined JSON object.");
  }
  if(validator(ast)) {
    throw new MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  if(validator(node)) {
    throw new MalformedAstError("Parameter node needs to be a JSON structure according to the schema.")
  }
  prependNodes(ast, [node]); 
}; 

/**
 * 
 * @param {*} ast 
 * @param {*} nodes 
 */
const prependNodes = function(ast, nodes) {
  if(typeof ast !== "object") {
    throw new InvalidParameterError("Parameter ast must be a well-defined JSON object."); 
  }
  if(validator(ast)) {
    throw new MalformedAstError("Parameter ast needs to be a JSON structure according to the schema.")
  }
  if(!nodes.isArray()) {
    throw new InvalidParameterError("Parameter nodes must be an array of node/children following the AST schema."); 
  }
  nodes.foreach((element) => {
    if(!validator(element)) {
      throw new MalformedAstError("Value: " + element + "is not a well-defined node following the AST schema in nodes."); 
    }
  }); 

  ast.children = ([]).concat(nodes, getChildren(ast)); 
  return Object.assign({}, ast); 
}; 

/**
 * 
 * @param {*} ast 
 * @param {*} name 
 */
const removeNodesByName = function(ast, name) {
  return pruneNodes(ast, (node) => {
    if(node.name.toLowerCase() === name.toLowerCase()) {
      return false; 
    }
    return true; 
  })
}; 

/**
 * 
 * @param {*} node 
 * @param {*} key 
 * @param {*} value 
 */
const setProperty = function(node, key, value) {

}

module.exports = {
  appendNode, 
  appendNodes,
  createNode 
}; 
