
const falafel = require('falafel');
const parseGlobals = require('acorn-globals');

describe('Detect global variables', () => {

  it('Uses falafel', () => {
    const output = falafel(`y = x`, function (node) {
      if (node.type === 'Identifier') {
        if (node.name === 'x') {
          node.update('p.' + node.source());
        }
      }
    });

    expect('' + output).toContain('p.x');
  })

  it.only('Handles ++ incrementer', () => {
    const output = falafel(`x++`, function (node) {
      if (node.type === 'Identifier') {
        if (node.name === 'x') {
          node.update('p.' + node.source());
        }
      }
      else if (node.type === 'UpdateExpression') {
        console.log(node);
      }
    });

    expect('' + output).toContain('p.x');
  })

});
