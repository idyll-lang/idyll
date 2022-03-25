const {
  createComponentNode,
  getNodeName,
  isTextNode,
  mapChildren,
  queryNodes
} = require('idyll-ast');

const TEXT_CONTAINER = 'TextContainer';

function wrapText(ast) {
  const query = node => getNodeName(node) === TEXT_CONTAINER;

  for (const node of queryNodes(ast, query)) {
    mapChildren(node, child =>
      isTextNode(child) ? createComponentNode('p', null, child) : child
    );
  }

  return ast;
}

module.exports = wrapText;
