
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
    expect(ast.getText(input)).to.eql('Hello Goodbye');
  });
});

//TODO:
//modifyNodesbyName, getChildren, walkNodes, prependNodes, setProperties, removeProperty, removeNodesbyName
