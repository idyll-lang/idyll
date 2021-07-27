var expect = require('expect.js');
var util = require('../src');
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
} = require('./testCases');

describe('ast', function() {
  it('append nodes to an existing ast', function() {
    var ast = Object.assign({}, astTestVar);
    expect(util.appendNode(ast, createComponent(11))).to.eql(
      updatedASTWithNode
    );
  });

  it('append multiple nodes', function() {
    var ast = Object.assign({}, astTestVar);
    expect(
      util.appendNodes(ast, [createComponent(11), createComponent(13)])
    ).to.eql(updatedASTWithNodes);
  });

  it('should return original ast when empty array is appened', function() {
    var ast = Object.assign({}, astTestVar);
    expect(util.appendNodes(ast, [])).to.eql(ast);
  });

  it('should create component without props and children', function() {
    expect(util.createNode(1, 'testNode', 'component')).to.eql({
      id: 1,
      type: 'component',
      name: 'testNode'
    });
  });

  it('should create component with children', function() {
    expect(
      util.createNode(11, 'p', 'component', null, [
        {
          id: 12,
          type: 'textnode',
          value: 'This is a new node'
        }
      ])
    ).to.eql(createComponent(11));
  });

  it('should create component with properties and children', function() {
    expect(
      util.createNode(
        11,
        'a',
        'component',
        {
          href: {
            type: 'value',
            value: 'www.example.com'
          }
        },
        [
          {
            id: 12,
            type: 'textnode',
            value: 'Link to a website'
          }
        ]
      )
    ).to.eql(createAnchorNode(11));
  });

  it('should create a textnode', function() {
    expect(util.createTextNode(12, 'Link to a website')).to.eql({
      id: 12,
      type: 'textnode',
      value: 'Link to a website'
    });
  });

  it('should get children of a node', function() {
    expect(util.getChildren(updatedASTWithNode)).to.eql(testChildren);
  });

  it('should set children for a node', function() {
    expect(
      util.setChildren(
        {
          id: 0,
          type: 'component',
          name: 'root'
        },
        testChildren
      )
    ).to.eql(updatedASTWithNode);
  });

  it('should get no children for a textnode', function() {
    expect(util.getChildren(createExampleTextNode(0))).to.eql([]);
  });

  it('should get no children for a var', function() {
    expect(util.getChildren(createExampleVarNode(0))).to.eql([]);
  });

  it('should get no children for a data', function() {
    expect(util.getChildren(createExampleData(0))).to.eql([]);
  });

  it('should set no children for a textnode', function() {
    expect(util.setChildren(createExampleTextNode(0), testChildren)).to.eql(
      createExampleTextNode(0)
    );
  });

  it('should set no children for a var', function() {
    expect(util.setChildren(createExampleVarNode(0), testChildren)).to.eql(
      createExampleVarNode(0)
    );
  });

  it('should set no children for a data', function() {
    expect(util.setChildren(createExampleData(0), testChildren)).to.eql(
      createExampleData(0)
    );
  });

  it('Should return true for component with children', function() {
    expect(util.hasChildren(astTestVar)).to.eql(true);
  });

  it('should set no children for a data', function() {
    expect(
      util.hasChildren({
        id: 0,
        type: 'component',
        name: 'root'
      })
    ).to.eql(false);
  });

  it('should get all the nodes from an ast using a name', function() {
    expect(util.getNodesByName(astTestVar, 'p')).to.eql([
      {
        id: 2,
        type: 'component',
        name: 'p',
        children: [
          {
            id: 3,
            type: 'textnode',
            value: 'This is the first paragraph'
          }
        ]
      },
      {
        id: 7,
        type: 'component',
        name: 'p',
        children: [
          {
            id: 8,
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
                id: 9,
                type: 'textnode',
                value: 'This is a link to a website'
              }
            ]
          },
          {
            id: 10,
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

  it('should get all the text from the ast', function() {
    expect(util.getText(astTestVar)).to.eql(
      'This is the first paragraph This is a header This is a link to a website'
    );
  });

  it('should find nodes based on a filter', function() {
    expect(
      util.filterNodes(astTestVar, node => util.hasChildren(node)).length
    ).to.eql(7);
  });

  it('should filter children of a passed node', function() {
    let ast = Object.assign({}, updatedASTWithNodes);
    expect(util.filterChildren(ast, node => node.id < 12)).to.eql(
      updatedASTWithNode
    );
  });

  it('should filter children of a passed node based on name', function() {
    let ast = Object.assign({}, astTestMeta);
    expect(util.filterChildren(ast, node => node.name !== 'meta')).to.eql(
      astTestVar
    );
  });

  it('should modify children of a passed node', function() {
    expect(
      util.modifyChildren(updatedASTWithNode, child => {
        let testnode = createComponent(child.id);
        return testnode;
      })
    ).to.eql(modifiedNode);
  });

  it('it shoud modfiy nodes by name', function() {
    expect(
      util.modifyNodesByName(astTestVar, 'p', node => {
        node.name = 'paragraph';
        return node;
      })
    ).to.eql(paraNode);
  });

  it('Return property names of a node', function() {
    expect(util.getPropertyKeys(createAnchorNode(0))).to.eql(['href']);
  });

  it('Returns property of a node', function() {
    expect(util.getProperty(createAnchorNode(0), 'href')).to.eql({
      type: 'value',
      value: 'www.example.com'
    });
  });

  it('Return null if proeprty does not exists', function() {
    expect(util.getProperty(astTestVar, 'name')).to.eql(null);
  });

  it('Returns true if a node has type attribute', function() {
    expect(
      util.hasType({
        id: 8,
        type: 'textnode',
        value:
          'This is an Idyll file. Write text\nas you please in here. To add interactivity,\nyou can add  different components to the text.'
      })
    ).to.eql(true);
  });

  it('Returns false if a node does not have type attribute', function() {
    expect(
      util.hasType({
        component: 'Header',
        title: 'Test',
        subtitle: 'Welcome to Idyll. Open index.idyll to start writing',
        author: 'Your Name Here',
        authorLink: 'https://idyll-lang.org',
        children: [],
        key: 0
      })
    ).to.eql(false);
  });
});

describe('markup conversion', function() {
  it('should convert a simple AST to markup', function() {
    const markup = util.toMarkup(astTestVar);
    expect(markup).to.eql(
      `

This is the first paragraph

[div]
# This is a header
  [var name:"testVar" value:\`3 * 3\` /]
  [p]
    [a href:"www.test.com"]This is a link to a website[/a]
    [data name:"testData" source:"test.csv" /]
  [/p]
[/div]
    `.trim()
    );
  });

  it("should break a complex component's properties onto multiple lines", function() {
    const markup = util.toMarkup({
      id: -1,
      type: 'component',
      name: 'div',
      children: [
        {
          id: 1,
          type: 'component',
          name: 'Table',
          properties: {
            data: {
              type: 'variable',
              value: 'wheat'
            },
            defaultPageSize: {
              type: 'value',
              value: 10
            },
            showPagination: {
              type: 'value',
              value: true
            },
            showPageSizeOptions: {
              type: 'value',
              value: false
            },
            showPageJump: {
              type: 'value',
              value: false
            }
          }
        }
      ]
    });

    expect(markup).to.eql(
      `
[Table
  data:wheat
  defaultPageSize:10
  showPagination:true
  showPageSizeOptions:false
  showPageJump:false /]
    `.trim()
    );
  });

  it('should serialize basic markdown elements', function() {
    const markup = util.toMarkup({
      id: -1,
      type: 'component',
      name: 'p',
      children: [
        {
          id: 1,
          type: 'textnode',
          value: 'One two '
        },
        {
          id: 2,
          type: 'component',
          name: 'em',
          children: [
            {
              id: 3,
              type: 'textnode',
              value: 'three'
            }
          ]
        }
      ]
    });

    expect(markup).to.eql(
      `
One two *three*
    `.trim()
    );
  });

  it('should normalize names when serializing', function() {
    const markup = util.toMarkup({
      id: -1,
      type: 'component',
      name: 'p',
      children: [
        {
          id: 1,
          type: 'component',
          name: 'my-component',
          properties: {},
          children: []
        },
        {
          id: 2,
          type: 'component',
          name: 'MyComponent',
          properties: {},
          children: []
        }
      ]
    });

    expect(markup).to.eql(
      `
[MyComponent /][MyComponent /]
    `.trim()
    );
  });

  it('should insert full width props when requested', function() {
    const markup = util.toMarkup(
      {
        id: -1,
        type: 'component',
        name: 'div',
        children: [
          {
            id: 1,
            type: 'component',
            name: 'Header',
            properties: {}
          },
          {
            id: 2,
            type: 'component',
            name: 'TextContainer',
            children: [
              {
                id: 3,
                type: 'textnode',
                value: 'Hello world.'
              }
            ]
          }
        ]
      },
      { insertFullWidth: true }
    );

    expect(markup.trim()).to.eql(
      `
[Header fullWidth:true /]

Hello world.
    `.trim()
    );
  });

  it('should ignore instrumental nodes', function() {
    const markup = util.toMarkup({
      id: -1,
      type: 'component',
      name: 'p',
      children: [
        {
          id: 1,
          type: 'component',
          name: 'my-component',
          properties: {},
          children: []
        },
        {
          id: 2,
          type: 'component',
          name: 'IdyllEditorDropTarget',
          properties: {},
          children: []
        }
      ]
    });

    expect(markup).to.eql(
      `
[MyComponent /]
    `.trim()
    );
  });
});
