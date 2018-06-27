
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

/*describe('walkNodesBreadthFirst', function() {
  it('walkNodesBreadthFirst does a breath first traversal of the abstract syntax tree', function() {
    const input = [['TextContainer1', [], [['p1', [], [['p3', [], ['just a simple string plus a component ']]]], ['VarDisplay1', [['var', ['variable', 'v1']]] , []]]], ['TextContainer2', [], [['p2', [], ['just a simple string plus a component ']], ['VarDisplay2', [['var', ['variable', 'v1']]] , []]]]];
    ast.walkNodesBreadthFirst(input, (node) => {
      if(typeof node === 'string') {
        console.log(node); 
      } else { 
        console.log(ast.getNodeName(node)); 
      }
    }); 
  });
});*/

  //TODO:
  //modifyNodesbyName, getChildren, walkNodes, prependNodes, setProperties, removeProperty, removeNodesbyName
