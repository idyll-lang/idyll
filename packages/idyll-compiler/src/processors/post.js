const smartquotes = require('smartquotes');

const {
  modifyNodesByName,
  modifyChildren,
  getNodesByName,
  prependNodes,
  removeNodesByName,
  removeProperty,
  setProperty,
  getProperty,
  getNodeName,
  createTextNode,
  createNode
} = require('idyll-ast/v1');

const attrConvert = list => {
  return (list || []).reduce((acc, [name, [type, val]]) => {
    if (type === 'value') {
      acc[name] = val;
    }
    return acc;
  }, {});
};

const cleanResults = (ast, options) => {
  if (typeof ast === 'string') {
    if (options.smartquotes) {
      return smartquotes(ast);
    }
    return ast;
  }

  return ast.map(node => {
    if (typeof node === 'string') {
      if (options.smartquotes) {
        return smartquotes(node);
      }
      return node;
    }

    node[2] = flattenChildren(node[2]);

    const name = node[0].toLowerCase();
    const rawNodes = ['pre', 'code', 'codehighlight', 'equation'];
    if (
      ['section', 'step', 'textcontainer'].indexOf(name) === -1 &&
      node[2].length === 1 &&
      typeof node[2][0] !== 'string' &&
      node[2][0][0] === 'p' &&
      node[2][0][2]
    ) {
      if (rawNodes.indexOf(name) > -1) {
        return [node[0], node[1], node[2][0][2]];
      }
      return [node[0], node[1], cleanResults(node[2][0][2], options)];
    }

    // don't apply cleaning to codeblocks
    if (rawNodes.indexOf(name) > -1) {
      return node;
    }
    return [node[0], node[1], cleanResults(node[2], options)];
  });
};

const flattenChildren = ast => {
  return (ast || []).reduce((acc, child) => {
    if (child[0] === '_idyllContainer') {
      acc = acc.concat(child[2]);
    } else {
      acc.push(child);
    }
    return acc;
  }, []);
};

const makeFullWidth = ast => {
  let currentTextContainer = [];
  const reduced = (ast || []).reduce((acc, child) => {
    if (typeof child === 'string') {
      currentTextContainer.push(child);
      return acc;
    }
    const attrs = attrConvert(child[1] || []);
    const childName = child[0].toLowerCase();
    if (
      ['derived', 'var', 'data', 'fullwidth', 'scroller'].indexOf(childName) >
        -1 ||
      attrs.fullWidth
    ) {
      if (childName === 'fullwidth') {
        child[0] = 'div';
        const className = getProperty(child, 'className');
        if (className) {
          switch (className[0]) {
            case 'value':
              child = setProperty(child, 'className', [
                'value',
                'fullWidth ' + className[1]
              ]);
              break;
            case 'expression':
              child = setProperty(child, 'className', [
                'expression',
                `"fullWidth " + (${className[1]})`
              ]);
              break;
            case 'variable':
              child = setProperty(child, 'className', [
                'expression',
                `"fullWidth " + (${className[1]})`
              ]);
              break;
            default:
              child = setProperty(child, 'className', ['value', 'fullWidth']);
          }
        } else {
          child = setProperty(child, 'className', ['value', 'fullWidth']);
        }
      } else {
        child = removeProperty(child, 'fullWidth');
      }

      if (currentTextContainer.length) {
        acc = acc.concat([['TextContainer', [], currentTextContainer], child]);
      } else {
        acc = acc.concat([child]);
      }
      currentTextContainer = [];
    } else {
      currentTextContainer.push(child);
    }
    return acc;
  }, []);

  if (currentTextContainer.length) {
    return reduced.concat([['TextContainer', [], currentTextContainer]]);
  }
  return reduced;
};

const hoistVariables = ast => {
  const vars = getNodesByName(ast, 'var');
  const derived = getNodesByName(ast, 'derived');
  const data = getNodesByName(ast, 'data');

  ast = removeNodesByName(ast, 'var');
  ast = removeNodesByName(ast, 'derived');
  ast = removeNodesByName(ast, 'data');

  ast = prependNodes(ast, derived);
  ast = prependNodes(ast, data);
  ast = prependNodes(ast, vars);

  return ast;
};

const wrapText = ast => {
  return modifyNodesByName(ast, 'TextContainer', node => {
    return modifyChildren(node, child => {
      if (typeof child === 'string') {
        return ['p', [], [child]];
      }
      return child;
    });
  });
};

/**
 * Plugin to find find valid urls in text nodes and make them hyperlinks.
 * @param {*} ast     AST passes from the parser representing the document.
 * @return A new modified AST with all hyperlinks linkified.
 */
const autoLinkify = ast => {
  return (ast || []).map(autoLinkifyHelper);
};

/**
 * Helper function for autoLinkify to check the type of node and modify them if necessary.
 * @param {*} node    node to be checked and modified if necessary.
 * @return modified node, if modification was required, else returns node.
 */
function autoLinkifyHelper(node) {
  if (typeof node === 'string') {
    return hyperLinkifiedVersion(node);
  } else if (
    ['a', 'code', 'pre', 'equation'].indexOf(getNodeName(node).toLowerCase()) >
    -1
  ) {
    return node;
  } else {
    return modifyChildren(node, autoLinkifyHelper);
  }
}

/**
 * Helper function for autoLinkifyHelper that modfies the text node if any hyperlinks are present.
 * @param {*} node
 * @return a modified node if any hyperlinks are present in the node, else returns node
 */
function hyperLinkifiedVersion(node) {
  let hyperLinks = getHyperLinksFromText(node);
  if (hyperLinks) {
    return seperateTextAndHyperLink(node, hyperLinks);
  } else {
    return node;
  }
}

/**
 * Helper function that seperates hyperlinks from textnodes
 * @param {*} textnode
 * @param {*} hyperlinks  Hyperlink array that has all the hyperlinks occuring in the textnode in order of appearance.
 * @return a new span element encampassing all the new textnodes and anchor tag.
 */
function seperateTextAndHyperLink(textnode, hyperlinks) {
  let match;
  let hyperLinkIndex = 0;
  let substringIndex = 0;
  let newChildNodes = [];
  while (hyperLinkIndex < hyperlinks.length) {
    let regexURL = new RegExp(hyperlinks[hyperLinkIndex], 'g');
    match = regexURL.exec(textnode.substring(substringIndex));
    if (match) {
      let linkEndIndex = regexURL.lastIndex;
      let linkStartIndex = linkEndIndex - hyperlinks[hyperLinkIndex].length;
      let textNodeValue = textnode.substring(substringIndex, linkStartIndex);
      if (textNodeValue !== '') {
        newChildNodes.push(
          createTextNode(textnode.substring(substringIndex, linkStartIndex))
        );
      }
      let anchorElement = createNode('a', [], [hyperlinks[hyperLinkIndex]]);
      setProperty(anchorElement, 'href', hyperlinks[hyperLinkIndex]);
      newChildNodes.push(anchorElement);
      textnode = textnode.substring(linkEndIndex);
      substringIndex = 0;
    }
    hyperLinkIndex++;
  }
  if (textnode != '') {
    newChildNodes.push(createTextNode(textnode));
  }
  return createNode('span', [], newChildNodes);
}

/**
 * This function returns an array with any hyperlinks in the passed textNode.
 * @param {*} textNode the text node to be tested for hyperlinks
 * @return List of URL's from the textNode
 */
function getHyperLinksFromText(textNode) {
  //Regular experession for matching URLs
  let regexURL = /(http|https|ftp|ftps)\:\/\/([a-zA-Z0-9\-\.]+\.)+[a-zA-Z]{2,3}(\/\S*)?/g;
  return textNode.match(regexURL);
}

module.exports = {
  cleanResults,
  flattenChildren,
  hoistVariables,
  makeFullWidth,
  wrapText,
  autoLinkify,
  autoLinkifyHelper,
  hyperLinkifiedVersion,
  seperateTextAndHyperLink,
  getHyperLinksFromText
};
