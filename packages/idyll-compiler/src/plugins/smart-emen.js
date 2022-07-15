import { getChildren, getNodeName, isTextNode } from 'idyll-ast';

const RAW_NODES = ['pre', 'code', 'codehighlight', 'equation'];

function smartEmEn(ast, context) {
  if (context.smartemen) {
    smartEmEnHelper(ast);
  }
  return ast;
}

function smartEmEnHelper(node) {
  if (isTextNode(node)) {
    node.value = processEmEn(node.value);
  } else {
    const name = getNodeName(node).toLowerCase();
    if (RAW_NODES.includes(name)) {
      return;
    }
    for (const child of getChildren(node)) {
      smartEmEnHelper(child);
    }
  }
}

// Any three hyphens are replaced with an em dash, and then any two hyphens are replaced with
// an en dash. In general, the longer em is used in US typography and en is used in
// UK typography, though is not a universal rule as em dash can also be used for line continuation
// and interrupted speech. It remains to be seen whether this is too simple or not.
// For instance, what if a long line of ----------------- should be
// left as it is, with only constructs such as x---x, x---, x-- and x--x actually being replaced. I note that Word/Outlook
// has never been very smart at this and just replaces when it sees three ---. However,
// given that Idyll is for interactive presentations, I suspect that these simple rules are "good enough".
//
function processEmEn(text) {
  // Replace any three hyphens with an em dash.
  //
  text = text.replace(/-{3}/g, '\u2014');

  // Now, replace any two hyphens with an en dash.
  //
  text = text.replace(/-{2}/g, '\u2013');

  return text;
}

export default smartEmEn;
