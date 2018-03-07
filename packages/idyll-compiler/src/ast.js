/**
 *
 * This module contains utility functions
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


module.exports = {

  getChildren: function(node) {
    return node[2] || [];
  },

  modifyChildren: function(node, modifier) {
    if (typeof node === 'string') {
      return node;
    }
    node[2] = this.getChildren(node).map((child) => {
      return modifier(child);
    });
    return node;
  },

  modifyNodesByName: function(ast, name, modifier) {
    const handleNode = (node) => {
      if (typeof node === 'string') {
        return node;
      }
      if (node[0].toLowerCase() === name.toLowerCase()) {
        node = modifier(node);
      }

      node = this.modifyChildren(node, handleNode);
      return node;
    }

    ast = ast.map((node) => {
      return handleNode(node);
    });
    return ast;
  },

  getProperty: function(node, key) {
    node[1].forEach((element) => {
      if (element[0] === key) {
        return element[1];
      }
    });
  },

  setProperty: function(node, key, value) {
    let hasSet = false;
    node[1].forEach((element) => {
        if (element[0] === key) {
          hasSet = true;
        }
    });
    if (!hasSet) {
      node[1] = node[1].concat([[key, value]]);
    }

    return node;
  },

  setProperties: function(node, properties) {
    Object.keys(properties).forEach((key) => {
      node = this.setProperty(node, key, properties[key]);
    })
    return node;
  },

  removeProperty: function(node, key) {
    node[1] = node[1].filter(([propName, propVale]) => {
      if (propName === key) {
        return false;
      }
      return true;
    })
    return node;
  }
}