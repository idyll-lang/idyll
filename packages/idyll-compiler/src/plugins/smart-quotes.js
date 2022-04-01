import smartquotes from 'smartquotes';
import { getChildren, getNodeName, isTextNode } from 'idyll-ast';

const RAW_NODES = ['pre', 'code', 'codehighlight', 'equation'];

function smartQuotes(ast, context) {
  if (context.smartquotes) {
    smartQuoteHelper(ast);
  }
  return ast;
}

function smartQuoteHelper(node) {
  if (isTextNode(node)) {
    node.value = smartquotes(node.value);
  } else {
    const name = getNodeName(node).toLowerCase();
    if (RAW_NODES.includes(name)) {
      return;
    }
    for (const child of getChildren(node)) {
      smartQuoteHelper(child);
    }
  }
}

export default smartQuotes;
