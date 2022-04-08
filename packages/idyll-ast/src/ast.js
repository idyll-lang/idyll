// -- Constants ----

/**
 * Property type string for value-typed properties.
 */
const VALUE = 'value';

/**
 * Property type string for variable-typed properties.
 */
const VARIABLE = 'variable';

/**
 * Property type string for expression-typed properties.
 */
const EXPRESSION = 'expression';

/**
 * Node type string for component nodes.
 */
const COMPONENT = 'component';

/**
 * Node type string for text nodes.
 */
const TEXTNODE = 'textnode';

/**
 * Node type string for var nodes.
 */
const VAR = 'var';

/**
 * Node type string for derived nodes.
 */
const DERIVED = 'derived';

/**
 * Node type string for data nodes.
 */
const DATA = 'data';

/**
 * Node type string for meta nodes.
 */
const META = 'meta';

// -- AST Nodes ----

/**
 * Create a new AST node.
 * @param {string} name Name of the node.
 * @param {string} type Type of the node.
 * @param {object} props Properties of the node.
 * @param {object[]} children Children of the node.
 * @return {object} A new AST node.
 */
function createNode(name, type, props = null, children = null) {
  const node = { type, name };
  if (props) {
    node.properties = { ...props };
  }
  if (children) {
    node.children = Array.from(children);
  }
  return node;
}

/**
 * Create a new component-typed node.
 * @param {string} name Name of the node.
 * @param {object[]} props Properties of the node.
 * @param {object[]} children Children of the node.
 * @return {object} A new component node.
 */
function createComponentNode(name, props = null, children = null) {
  return createNode(name, COMPONENT, props, children);
}

/**
 * Create a new text node.
 * @param {string} value Text content on the node.
 * @return {object} A new text node.
 */
function createTextNode(value) {
  // typeCheckString(value, 'value');
  return { type: TEXTNODE, value };
}

/**
 * Test if a node is a text node.
 * @param {object} node The AST node.
 * @return {boolean} True if the node is a text node, false otherwise.
 */
function isTextNode(node) {
  return node.type === TEXTNODE;
}

/**
 * Test if a node is a component node.
 * @param {object} node The AST node.
 * @return {boolean} True if the node is a component node, false otherwise.
 */
function isComponentNode(node) {
  return node.type === COMPONENT;
}

/**
 * Test if a node is a variable node, one of 'var', 'derived', or 'data'.
 * @param {object} node The AST node.
 * @return {boolean} True if the node is a variable node, false otherwise.
 */
function isVariableNode(node) {
  return node.type === VAR || node.type === DERIVED || node.type === DATA;
}

/**
 * Test if a node is a meta node.
 * @param {object} node The AST node.
 * @return {boolean} True if the node is a mate node, false otherwise.
 */
function isMetaNode(node) {
  return node.type === META;
}

/**
 * Get the name of an AST node. If the node is a component, returns
 * the component name, otherwise returns the node type.
 * @param {object} node The AST node.
 * @return {string} The name of the node, or null if not defined.
 */
function getNodeName(node) {
  return isComponentNode(node) ? node.name : node.type;
}

/**
 * Get the type of an AST node.
 * @param {object} node The AST node.
 * @return {string} The type of the node, or null if not defined.
 */
function getNodeType(node) {
  return node.type || null;
}

// -- AST Node Children ----

/**
 * Test if an AST node has any child nodes.
 * @param {*} node An AST node.
 * @returns {boolean} True if the node has children, false otherwise.
 */
function hasChildren(node) {
  return node.children ? node.children.length > 0 : false;
}

/**
 * Retrieve the children nodes of a parent node.
 * This method returns a direct reference to an underlying child
 * array. Callers should take care not to modify the returned array.
 * @param {object} node The parent node.
 * @return {object[]} The children of the node, or an empty array if none.
 */
function getChildren(node) {
  return node.children || [];
}

/**
 * Sets the child nodes of an AST node.
 * @param {object} node The parent node.
 * @param {object[]} children The children nodes to set.
 * @return {object} The modified AST node.
 */
function setChildren(node, children) {
  // typeCheckArray(children, 'children');
  node.children = children;
  return node;
}

/**
 * Append a child node to a parent node.
 * @param {object} node The parent AST node.
 * @param {object} child The child AST node to append.
 * @return {object} A modifed AST node.
 */
function appendChild(node, child) {
  return appendChildren(node, [child]);
}

/**
 * Append multiple child nodes to a parent node.
 * @param {object} node The parent AST node.
 * @param {object[]} children The children AST nodes to append.
 * @return {object} A modified AST node.
 */
function appendChildren(node, children) {
  // typeCheckArray(children, 'children');
  const base = node.children || [];
  node.children = base.concat(children);
  return node;
}

/**
 * Prepend a child node to a parent node.
 * @param {object} node The parent AST node.
 * @param {object} child The child AST node to prepend.
 * @return {object} A modifed AST node.
 */
function prependChild(node, child) {
  return prependChildren(node, [child]);
}

/**
 * Prepend multiple child nodes to a parent node.
 * @param {object} node The parent AST node.
 * @param {object[]} children The children AST nodes to prepend.
 * @return {object} A modified AST node.
 */
function prependChildren(node, children) {
  // typeCheckArray(children, 'children');
  node.children = children.concat(node.children || []);
  return node;
}

/**
 * Filter child nodes, retaining only node that match the filter predicate.
 * @param {object} node A parent AST node.
 * @param {function(object): boolean} predicate Filter function for child nodes.
 * @return {object} The modified parent node.
 */
function filterChildren(node, predicate) {
  if (hasChildren(node)) {
    node.children = node.children.filter(predicate);
  }
  return node;
}

/**
 * Modify child nodes by applying a map function to each. The results of the
 * map function become the new child nodes.
 * @param {object} node A parent AST node.
 * @param {function} mapFunc Map function applied to child nodes.
 * @return {object} The modified parent node.
 */
function mapChildren(node, mapFunc) {
  if (hasChildren(node)) {
    node.children = node.children.map(mapFunc);
  }
  return node;
}

// -- AST Node Properties ----

function hasKeys(object) {
  for (const key in object) return true;
  return false;
}

/**
 * Tests if an AST node has any defined properties.
 * @param {*} node The AST node.
 * @returns {boolean} True is the node has properties, false otherwise.
 */
function hasProperties(node) {
  return hasKeys(node.properties);
}

/**
 * Retrieves the properties object for an AST node.
 * @param {object} node The AST node.
 * @returns {object} The properties object, or null if none.
 */
function getProperties(node) {
  return node.properties || null;
}

/**
 * Add a set of properties to an AST node. Any existing
 * properties with matching keys will be overwritten.
 * @param {object} node The AST node.
 * @param {object} properties A properties object. Object keys are
 *  property names, object values must be property data objects.
 * @returns {object} The modified AST node.
 */
function setProperties(node, properties) {
  for (const key in properties) {
    setProperty(node, key, properties[key]);
  }
  return node;
}

/**
 * Remove all properties from an AST node.
 * @param {object} node The AST node.
 * @returns {object} The modified AST node.
 */
function clearProperties(node) {
  delete node.properties;
  return node;
}

/**
 * Retrieves an array of property keys for a node.
 * @param {object} node The AST node.
 * @return {string[]} The property keys, or an empty array if none.
 */
function getPropertyKeys(node) {
  return Object.keys(node.properties || {});
}

/**
 * Retrieves the property type for a node property.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @return {string} The property type, or null if the property is not defined.
 */
function getPropertyType(node, key) {
  const prop = getProperty(node, key);
  return (prop && prop.type) || null;
}

/**
 * Retrieves the property value for a node property.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @return {string} The property value, or null if the property is not defined.
 */
function getPropertyValue(node, key) {
  const prop = getProperty(node, key);
  return (prop && prop.value) || null;
}

/**
 * Test if a property with the given key is defined on a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @return {boolean} True if the property is defined, else false.
 */
function hasProperty(node, key) {
  return (node.properties && node.properties.hasOwnProperty(key)) || false;
}

/**
 * Retrieves a property of a node given its key.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @return {object} The property data, or null if the property does not exist.
 */
function getProperty(node, key) {
  return hasProperty(node, key) ? node.properties[key] : null;
}

/**
 * Set a property of a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @param {object} data The property data, should
 *  be an object with type and value properties.
 * @return {object} The modfied AST node.
 */
function setProperty(node, key, data) {
  // TODO: type checking of property data?
  if (!node.properties) {
    node.properties = {};
  }
  node.properties[key] = data;
  return node;
}

/**
 * Set a value-typed property of a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @param {*} value The property value.
 * @return {object} The modfied AST node.
 */
function setValueProperty(node, key, value) {
  return setProperty(node, key, { type: VALUE, value });
}

/**
 * Set a variable-typed property of a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @param {string} value A reactive variable name.
 * @return {object} The modfied AST node.
 */
function setVariableProperty(node, key, value) {
  return setProperty(node, key, { type: VARIABLE, value });
}

/**
 * Set an expression-typed property of a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @param {string} value A JavaScript expression string.
 * @return {object} The modfied AST node.
 */
function setExpressionProperty(node, key, value) {
  return setProperty(node, key, { type: EXPRESSION, value });
}

/**
 * Remove a property of a node.
 * @param {object} node The AST node.
 * @param {string} key The property key.
 * @return {object} The modified AST node.
 */
function removeProperty(node, key) {
  if (hasProperty(node, key)) {
    const { [key]: remove, ...props } = node.properties;
    if (hasKeys(props)) {
      node.properties = props;
    } else {
      delete node.properties;
    }
  }
  return node;
}

// -- AST Traversal ----

/**
 * Perform a preorder depth-first traversal of the AST.
 * @param {object} node The AST node at which to begin the traversal.
 * @param {function} callack Callback function invoked for each visited node.
 */
function cloneNode(node) {
  const clone = { ...node };
  if (clone.properties) {
    clone.properties = { ...clone.properties };
  }
  if (clone.children) {
    clone.children = clone.children.map(child => cloneNode(child));
  }
  return clone;
}

/**
 * Perform a preorder depth-first traversal of the AST.
 * @param {object} node The AST node at which to begin the traversal.
 * @param {function} callack Callback function invoked for each visited node.
 */
function visitNodes(node, callback) {
  callback(node);
  getChildren(node).forEach(node => visitNodes(node, callback));
}

/**
 * Retrieve all nodes that match a given predicate function.
 * @param {object} node The AST node at which to begin searching.
 *  Only this node and its descendants are considered.
 * @param {function(object): boolean} predicate Filter function to test nodes.
 *  If the predicate returns true, the node is included in the result.
 * @returns {object[]} An array of AST nodes that match the predicate.
 */
function queryNodes(node, predicate) {
  const nodes = [];

  visitNodes(node, n => {
    if (predicate(n)) {
      nodes.push(n);
    }
  });

  return nodes;
}

/**
 * Extract the text from all text nodes under an AST node.
 * @param {object} ast The AST node.
 * @return {string} The extracted text, concatenated into strings.
 */
function extractText(node) {
  const texts = [];
  visitNodes(node, n => {
    if (isTextNode(n)) {
      texts.push(n.value);
    }
  });
  return texts.join(' ');
}

/**
 * Remove any descendant nodes that match a given predicate function.
 * @param {object} node The AST node at which to begin searching.
 *  Only descendants of this node are considered for removal.
 * @param {function(object): boolean} predicate Filter function to test nodes.
 *  If the predicate returns true, the node is removed from the AST.
 * @returns {object} The AST node width descendants removed.
 */
function removeNodes(node, predicate) {
  if (hasChildren(node)) {
    node.children = node.children.filter(child => {
      if (predicate(child)) {
        return false;
      } else {
        removeNodes(child, predicate);
        return true;
      }
    });
  }
  return node;
}

export {
  VALUE,
  VARIABLE,
  EXPRESSION,
  COMPONENT,
  TEXTNODE,
  VAR,
  DERIVED,
  DATA,
  META,
  createNode,
  createComponentNode,
  createTextNode,
  isTextNode,
  isComponentNode,
  isVariableNode,
  isMetaNode,
  getNodeName,
  getNodeType,
  hasChildren,
  getChildren,
  setChildren,
  appendChild,
  appendChildren,
  prependChild,
  prependChildren,
  filterChildren,
  mapChildren,
  hasProperties,
  getProperties,
  setProperties,
  clearProperties,
  getPropertyKeys,
  getPropertyType,
  getPropertyValue,
  hasProperty,
  getProperty,
  setProperty,
  setValueProperty,
  setVariableProperty,
  setExpressionProperty,
  removeProperty,
  cloneNode,
  visitNodes,
  queryNodes,
  extractText,
  removeNodes
};
