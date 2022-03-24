const expect = require('expect.js');
const util = require('../src');
const {
  astTestVar,
  astTestMeta,
  updatedASTWithNode,
  updatedASTWithNodes,
  testChildren,
  createComponent,
  createAnchorNode,
  createExampleData,
  createExampleTextNode,
  createExampleVarNode,
  modifiedNode,
  paraNode
} = require('./test-data');

describe('ast', function() {
  it('should append child to an existing ast', function() {
    const ast = astTestVar();
    expect(util.appendChild(ast, createComponent())).to.eql(
      updatedASTWithNode()
    );
  });

  it('should append multiple child nodes', function() {
    const ast = astTestVar();
    expect(
      util.appendChildren(ast, [createComponent(), createComponent()])
    ).to.eql(updatedASTWithNodes());
  });

  it('should return original ast when empty array is appended', function() {
    const ast = astTestVar();
    expect(util.appendChildren(ast, [])).to.eql(ast);
  });

  it('should create component without props and children', function() {
    expect(util.createNode('testNode', 'component')).to.eql({
      type: 'component',
      name: 'testNode'
    });
  });

  it('should create component with children', function() {
    const test = util.createNode('p', 'component', null, [
      {
        type: 'textnode',
        value: 'This is a new node'
      }
    ]);
    expect(test).to.eql(createComponent(11));
  });

  it('should create component node with properties and children', function() {
    expect(
      util.createComponentNode(
        'a',
        {
          href: {
            type: 'value',
            value: 'www.example.com'
          }
        },
        [
          {
            type: 'textnode',
            value: 'Link to a website'
          }
        ]
      )
    ).to.eql(createAnchorNode());
  });

  it('should create a textnode', function() {
    expect(util.createTextNode('Link to a website')).to.eql({
      type: 'textnode',
      value: 'Link to a website'
    });
  });

  it('should get children of a node', function() {
    expect(util.getChildren(updatedASTWithNode())).to.eql(testChildren());
  });

  it('should set children for a node', function() {
    expect(
      util.setChildren(
        {
          type: 'component',
          name: 'root'
        },
        testChildren()
      )
    ).to.eql(updatedASTWithNode());
  });

  it('should get no children for a textnode', function() {
    expect(util.getChildren(createExampleTextNode())).to.eql([]);
  });

  it('should get no children for a var', function() {
    expect(util.getChildren(createExampleVarNode())).to.eql([]);
  });

  it('should get no children for a data', function() {
    expect(util.getChildren(createExampleData())).to.eql([]);
  });

  // it('should set no children for a textnode', function() {
  //   expect(util.setChildren(createExampleTextNode(), testChildren())).to.eql(
  //     createExampleTextNode()
  //   );
  // });

  // it('should set no children for a var', function() {
  //   expect(util.setChildren(createExampleVarNode(), testChildren())).to.eql(
  //     createExampleVarNode()
  //   );
  // });

  // it('should set no children for a data', function() {
  //   expect(util.setChildren(createExampleData(0), testChildren())).to.eql(
  //     createExampleData()
  //   );
  // });

  it('should return true for component with children', function() {
    expect(util.hasChildren(astTestVar())).to.eql(true);
  });

  it('should return false for component without children', function() {
    expect(
      util.hasChildren({
        type: 'component',
        name: 'root'
      })
    ).to.eql(false);
  });

  it('should query nodes from an ast matching a name', function() {
    expect(util.queryNodes(astTestVar(), n => n.name === 'p')).to.eql([
      {
        type: 'component',
        name: 'p',
        children: [
          {
            type: 'textnode',
            value: 'This is the first paragraph'
          }
        ]
      },
      {
        type: 'component',
        name: 'p',
        children: [
          {
            type: 'component',
            name: 'a',
            properties: {
              href: {
                type: 'value',
                value: 'www.test.com'
              }
            },
            children: [
              {
                type: 'textnode',
                value: 'This is a link to a website'
              }
            ]
          },
          {
            type: 'data',
            properties: {
              name: {
                type: 'value',
                value: 'testData'
              },
              source: {
                type: 'value',
                value: 'test.csv'
              }
            }
          }
        ]
      }
    ]);
  });

  it('should extract the text from the ast', function() {
    expect(util.extractText(astTestVar())).to.eql(
      'This is the first paragraph This is a header This is a link to a website'
    );
  });

  it('should find nodes based on a filter', function() {
    expect(
      util.queryNodes(astTestVar(), node => util.hasChildren(node)).length
    ).to.eql(7);
  });

  it('should filter children of a passed node', function() {
    const ast = updatedASTWithNodes();

    let count = 0;
    const predicate = node => {
      if (
        node.name === 'p' &&
        node.children &&
        node.children[0]?.value === 'This is a new node'
      ) {
        ++count;
        if (count > 1) return false;
      }
      return true;
    };
    expect(util.filterChildren(ast, predicate)).to.eql(updatedASTWithNode());
  });

  it('should filter children of a passed node based on name', function() {
    const test = util.filterChildren(
      astTestMeta(),
      node => node.name !== 'meta'
    );
    expect(test).to.eql(astTestVar());
  });

  it('should map children of a passed node', function() {
    expect(
      util.mapChildren(updatedASTWithNode(), () => createComponent())
    ).to.eql(modifiedNode());
  });

  it('should modify nodes matching a query', function() {
    const ast = astTestVar();
    util.visitNodes(ast, node => {
      if (node.name === 'p') {
        node.name = 'paragraph';
      }
    });
    expect(ast).to.eql(paraNode());
  });

  it('should return property keys of a node', function() {
    expect(util.getPropertyKeys(createAnchorNode(0))).to.eql(['href']);
  });

  it('should return property data of a node', function() {
    expect(util.getProperty(createAnchorNode(), 'href')).to.eql({
      type: 'value',
      value: 'www.example.com'
    });
  });

  it('should return null if a property does not exist', function() {
    expect(util.getProperty(astTestVar(), 'name')).to.eql(null);
  });

  it('should return true if a node is a text node', function() {
    expect(util.isTextNode({ type: 'textnode', value: 'text' })).to.eql(true);
  });

  it('should return false if a node is not a text node', function() {
    expect(
      util.isTextNode({ type: 'component', name: 'header', children: [] })
    ).to.eql(false);
  });
});
