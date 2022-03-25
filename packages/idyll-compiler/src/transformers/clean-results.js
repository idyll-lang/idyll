import { getChildren, getNodeName, isTextNode, mapChildren } from 'idyll-ast';

import flattenChildren from './flatten-children';

const RAW_NODES = ['pre', 'code', 'codehighlight', 'equation'];

function cleanResults(ast) {
  if (isTextNode(ast)) {
    return ast;
  }

  return mapChildren(ast, node => {
    if (isTextNode(node)) {
      return node;
    }

    flattenChildren(node);
    const name = getNodeName(node).toLowerCase();
    const children = getChildren(node);

    // if not a section, step, or textcontainer component &&
    // node has one child &&
    // node child is not a textnode &&
    // node child is a p component &&
    // node child has children, THEN
    //  if node is a raw node, return the child nodes' children as node's value
    //  else recursively clean using grandchild rather than child
    // ELSE
    //  if node is a raw node, return it as is
    // ELSE recursively clean children
    if (
      !['section', 'step', 'textcontainer'].includes(name) &&
      children.length === 1 &&
      getNodeName(children[0]) === 'p' &&
      getChildren(children[0]).length
    ) {
      if (!RAW_NODES.includes(name)) {
        cleanResults(children[0]);
      }
      node.children = children[0].children;
    } else {
      // don't apply cleaning to codeblocks
      if (!RAW_NODES.includes(name)) {
        cleanResults(node);
      }
    }

    return node;
  });
}

export default cleanResults;
