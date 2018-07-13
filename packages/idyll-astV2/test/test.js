
var expect = require('expect.js');
var ast = require('../src');

describe('sanity check', function() {
  it('should not blow up', function() {
    const input = [['div', [], []]];
    expect(ast.getNodesByName(input, 'div')).to.eql([['div', [], []]]);
  });
});

describe('getText', function() {
  it('getText returns text of node', function() {
    const input = [['h1', [],'Hello' ],['h1',[],'Goodbye']]
    expect(ast.getText(input[0])).to.eql('Hello');
    expect(ast.getText(input[1])).to.eql('Goodbye');
  });


  //TODO:
  //modifyNodesbyName, getChildren, walkNodes, prependNodes, setProperties, removeProperty, removeNodesbyName

})
