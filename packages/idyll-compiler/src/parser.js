const grammar = require('./grammar');
const ast = require('./ast');

const nearley = require('nearley');
const smartquotes = require('smartquotes');

const flattenChildren = (nodeList) => {
  return (nodeList || []).reduce((acc, child) => {
    if (child[0] === '_idyllContainer') {
      acc = acc.concat(child[2]);
    } else {
      acc.push(child);
    }
    return acc;
  }, []);
}

const attrConvert = (list) => {
  return (list || []).reduce(
    (acc, [name, [type, val]]) => {
      if (type === 'value') {
        acc[name] = val;
      }
      return acc;
    },
    {}
  )
}

const makeFullWidth = (nodeList) => {
  let currentTextContainer = [];
  const reduced = (nodeList || []).reduce((acc, child) => {

    if (typeof child === 'string') {
      currentTextContainer.push(child);
      return acc;
    }
    const attrs = attrConvert(child[1] || []);
    const childName = child[0].toLowerCase();
    if ((['derived', 'fullwidth', 'var'].indexOf(childName) > -1) || attrs.fullWidth) {
        if (childName === 'fullwidth') {
          child[0] = 'div';
          const className = ast.getProperty(child, 'className');
          if (className) {
            switch (className[0]) {
              case 'value':
                child = ast.setProperty(child, 'className', ['value', 'fullWidth ' + className[1]]);
                break;
              case 'expression':
                child = ast.setProperty(child, 'className', ['expression', `"fullWidth " + (${className[1]})`]);
                break;
              case 'variable':
                child = ast.setProperty(child, 'className', ['expression', `"fullWidth " + (${className[1]})`]);
                break;
              default:
                child = ast.setProperty(child, 'className', ['value', 'fullWidth']);
            }
          } else {
            child = ast.setProperty(child, 'className', ['value', 'fullWidth']);
          }
        } else {
          child = ast.removeProperty(child, 'fullWidth');
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
}

const wrapText = (nodeList) => {
  return ast.modifyNodesByName(nodeList, 'TextContainer', (node) => {
    return ast.modifyChildren(node, (child) => {
      if (typeof child === 'string') {
        return ['p', [], [child]];
      }
      return child;
    })
  })
}

module.exports = function(input, tokens, positions, options) {
  options = options || {};

  /**
   * Clean results removes unnecessary
   * <p> tags inside of other blocks.
   */
  const cleanResults = (node) => {
    if (typeof node === 'string') {
      if (options.smartquotes) {
        return smartquotes(node);
      }
      return node;
    }

    // flatten children
    node[2] = flattenChildren(node[2]);

    if (node[0] !== 'p'
      && node[2].length === 1
      && typeof node[2][0] !== 'string'
      && node[2][0][0] === 'p'
      && node[2][0][2]
      && node[2][0][2].length === 1
      && typeof node[2][0][2][0] === 'string') {
        return [node[0], node[1], node[2][0][2]];
    }

    // don't apply cleaning to codeblocks
    if (['pre', 'code', 'codehighlight'].indexOf(node[0].toLowerCase()) > -1) {
      return node;
    }
    return [node[0], node[1], node[2].map(cleanResults)];
  };

  const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  try {
    p.feed(tokens);
  } catch(err) {
    const cleaned = tokens.substring(0, err.offset).replace(/"[^"]*"/g, 'x');
    const index = cleaned.match(/ /g).length;
    const position = positions[index];
    const message = 'Error parsing input at line ' + position[0] + ', column ' + position[1] + '\n\n' + input.split('\n')[position[0] - 1] + '\n' + Array(Math.max(0, position[1] - 2)).join(' ') + '^^^';
    const e = new Error(message);
    e.row = position[0];
    e.column = position[1];
    throw e;
  }
  var results = p.results;

  if (results.length) {
    // console.log('Results length: ' + results.length);
    if (results.length > 1) {
      // console.log(JSON.stringify(results, null, 2));
      // console.log(str);
    }
    // console.log(JSON.stringify(results[0]));

    return wrapText(
      makeFullWidth(
          flattenChildren(results[0])
      ).map(cleanResults)
    );
  }

  throw new Error('No parse results');
}
