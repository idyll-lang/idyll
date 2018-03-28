
var expect = require('expect.js');
var ast = require('../src');

describe('sanity check', function() {
  it('should not blow up', function() {
    const input = [['div', [], []]];
    expect(ast.getNodesByName(input, 'div')).to.eql([['div', [], []]]);
  });
});
