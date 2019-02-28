# idyll-ast

Utilities for dealing with Idyll AST. This is most likely useful in the context of compiler plugins.

## Installation

```
npm install --save idyll-ast
```

## Usage

```js
const ast = require('idyll-ast');
const compile = require('idyll-compiler');

compile(`
 # idyll markup goes here
`).then(ast => {
  const transformedAST = ast.modifyNodesByName(inputAST, 'h1', node => {
    node = ast.setProperty(node, 'className', 'super-great-header');
    return node;
  });
});
```

### Plugin Example

This plugin just appends a new node at the end of the input:

```js
const ast = require('idyll-ast');

module.exports = inputAST => {
  return ast.appendNodes(inputAST, []);
};
```

## API

- `appendNode(ast, newNode)`
- `appendNodes(ast, newNodes)`
- `createNode(name, props, children)`
- `getChildren(node)`
- `getNodesByName(ast, 'name')`
- `filterChildren(node, filterFunction)`
- `filterNodes(ast, filterFunction)`
- `modifyChildren(node, modFunction)`
- `modifyNodesByName(ast, 'name', modFunction)`
- `getProperty(node, 'propName')`
- `prependNode(ast, newNode)`
- `prependNodes(ast, newNodes)`
- `removeNodesByName(ast, 'name')`
- `setProperties(node, { prop1: value, prop2: value })`
- `setProperty(node, 'prop', value)`
- `removeProperty(node, 'prop')`
- `walkNodes(ast, func)`
