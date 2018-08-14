var expect = require('expect.js');
var util = require('../src');
const {
  astTestVar,
  updatedASTWithNode,
  updatedASTWithNodes,
  testChildren,
  createComponent,
  createAnchorNode,
  createExampleData,
  createExampleTextNode,
  createExampleVarNode
} = require('./testCases');

describe('ast', function () {

  it('append nodes to an existing ast', function () {
    var ast = Object.assign({}, astTestVar);
    expect(util.appendNode(ast, createComponent(11))).to.eql(updatedASTWithNode);
  });

  it('append multiple nodes', function () {
    var ast = Object.assign({}, astTestVar);
    expect(util.appendNodes(ast, [createComponent(11), createComponent(13)])).to.eql(updatedASTWithNodes);
  });

  it('should return original ast when empty array is appened', function () {
    var ast = Object.assign({}, astTestVar);
    expect(util.appendNodes(ast, [])).to.eql(ast);
  });

  it('should create component without props and children', function () {
    expect(util.createNode(1, "testNode", "component")).to.eql({
      "id": 1,
      "type": "component",
      "name": "testNode"
    });
  });

  it('should create component with children', function () {
    expect(util.createNode(11, "p", "component", null, [{
      "id": 12,
      "type": "textnode",
      "value": "This is a new node"
    }])).to.eql(createComponent(11));
  });

  it('should create component with properties and children', function () {
    expect(util.createNode(11, "a", "component", {
      "href": {
        "type": "value",
        "value": "www.example.com"
      }
    }, [{
      "id": 12,
      "type": "textnode",
      "value": "Link to a website"
    }])).to.eql(createAnchorNode(11));
  });

  it('should create a textnode', function () {
    expect(util.createTextNode(12, "Link to a website")).to.eql({
      "id": 12,
      "type": "textnode",
      "value": "Link to a website"
    });
  });

  it('should get children of a node', function () {
    expect(util.getChildren(updatedASTWithNode)).to.eql(testChildren);
  });

  it('should set children for a node', function () {
    expect(util.setChildren({
      "id": 0,
      "type": "component",
      "name": "root"
    }, testChildren)).to.eql(updatedASTWithNode);
  });

  it('should get no children for a textnode', function () {
    expect(util.getChildren(createExampleTextNode(0))).to.eql([]);
  });

  it('should get no children for a var', function () {
    expect(util.getChildren(createExampleVarNode(0))).to.eql([]);
  });

  it('should get no children for a data', function () {
    expect(util.getChildren(createExampleData(0))).to.eql([]);
  });

  it('should set no children for a textnode', function () {
    expect(util.setChildren(createExampleTextNode(0), testChildren)).to.eql(createExampleTextNode(0));
  });

  it('should set no children for a var', function () {
    expect(util.setChildren(createExampleVarNode(0), testChildren)).to.eql(createExampleVarNode(0));
  })

  it('should set no children for a data', function () {
    expect(util.setChildren(createExampleData(0), testChildren)).to.eql(createExampleData(0));
  });

  it('Should return true for component with children', function () {
    expect(util.hasChildren(astTestVar)).to.eql(true);
  });

  it('should set no children for a data', function () {
    expect(util.hasChildren({
      "id": 0,
      "type": "component",
      "name": "root"
    })).to.eql(false);
  });

  it('should get all the nodes from an ast using a name', function () {
    expect(util.getNodesByName(astTestVar, "p")).to.eql([{
      "id": 2,
      "type": "component",
      "name": "p",
      "children": [{
        "id": 3,
        "type": "textnode",
        "value": "This is the first paragraph"
      }]
    }, {
      "id": 7,
      "type": "component",
      "name": "p",
      "children": [{
          "id": 8,
          "type": "component",
          "name": "a",
          "properties": {
            "href": {
              "type": "value",
              "value": "www.test.com"
            }
          },
          "children": [{
            "id": 9,
            "type": "textnode",
            "value": "This is a link to a website"
          }]
        },
        {
          "id": 10,
          "type": "data",
          "properties": {
            "name": {
              "type": "value",
              "value": "testData"
            },
            "source": {
              "type": "value",
              "value": "test.csv"
            }
          }
        }
      ]
    }]);
  });

  it('should get all the text from the ast', function () {
    expect(util.getText(astTestVar)).to.eql("This is the first paragraph This is a header This is a link to a website");
  });

  /*it('should find nodes based on a filter', function () {
    expect(util.filterNodes((node) => hasChildren(node))).to.eql(); 
  })*/

});