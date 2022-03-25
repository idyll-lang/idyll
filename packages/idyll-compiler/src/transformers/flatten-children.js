import { getChildren, getNodeName, hasChildren } from 'idyll-ast';

const IDYLL_CONTAINER = '_idyllContainer';

function flattenChildren(node) {
  if (hasChildren(node)) {
    const flat = [];
    for (const child of getChildren(node)) {
      if (getNodeName(child) === IDYLL_CONTAINER) {
        flat.push.apply(flat, child.children);
      } else {
        flat.push(child);
      }
    }
    node.children = flat;
  }

  return node;
}

export default flattenChildren;
