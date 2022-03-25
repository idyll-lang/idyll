import {
  VALUE,
  createComponentNode,
  createTextNode,
  isTextNode,
  mapChildren
} from 'idyll-ast';

const urlPattern = /(http|https|ftp|ftps)\:\/\/([a-zA-Z0-9\-\.]+\.)+[a-zA-Z]{2,3}(\/\S*)?/g;

/**
 * Plugin to find find valid urls in text nodes and make them hyperlinks.
 * @param {*} ast AST passes from the parser representing the document.
 * @return A new modified AST with all hyperlinks linkified.
 */
function autoLinkify(node) {
  return isTextNode(node) ? linkifyNode(node) : mapChildren(node, autoLinkify);
}

function linkifyNode(node) {
  let textIndex = 0;
  const text = node.value;
  const nodes = [];

  for (const match of text.matchAll(urlPattern)) {
    const [href] = match;
    const { index } = match;

    // extract prior text to new text node
    if (index > textIndex) {
      nodes.push(createTextNode(text.slice(textIndex, index)));
    }

    // generate hyperlink
    nodes.push(
      createComponentNode('a', { href: { type: VALUE, value: href } }, [
        createTextNode(href)
      ])
    );

    // update index into source text
    textIndex = index + href.length;
  }

  if (!nodes.length) {
    return node;
  }

  // extract any trailing text to new text node
  if (textIndex < text.length) {
    nodes.push(createTextNode(text.slice(textIndex)));
  }

  return createComponentNode('span', null, nodes);
}

export default autoLinkify;
