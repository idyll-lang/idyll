
var expect = require('expect.js');
var ast = require('../src');
//var compilerTest = require('../../idyll-compiler/test/test.js')

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
});

/*describe('dfsTraversal', function() {
  it('dfsTraversal does a breath first traversal of the abstract syntax tree', function() {
    const input = [['var', [['name', ['value', 'v1']], ['value', ['value', 5]]], []], ['TextContainer', [], [['p', [], ['just a simple string plus a component ']], ['VarDisplay', [['var', ['variable', 'v1']]] , []]]]]; 
    ast.dfsTraversal(input, (node) => {
     console.log(ast.getNodeName(node)); 
    }); 
  }); 
}); */

  //TODO:
  //modifyNodesbyName, getChildren, walkNodes, prependNodes, setProperties, removeProperty, removeNodesbyName
