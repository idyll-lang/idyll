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

});
