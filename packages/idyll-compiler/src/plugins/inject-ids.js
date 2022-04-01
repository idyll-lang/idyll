const { visitNodes } = require('idyll-ast');

function injectIds(ast) {
  let id = -1;
  visitNodes(ast, node => (node.id = ++id));
  return ast;
}

module.exports = injectIds;
