const expect = require('expect.js');
const { createComponentNode } = require('../src');
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
  describe('createNode', function() {
    it('should create node without props and children', function() {
      expect(util.createNode('testNode', 'component')).to.eql({
        type: 'component',
        name: 'testNode'
      });
    });

    it('should create node with children', function() {
      const test = util.createNode('p', 'component', null, [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]);
      expect(test).to.eql(createComponent(11));
    });
  });

  describe('createComponentNode', function() {
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
  });

  describe('createTextNode', function() {
    it('should create a textnode', function() {
      expect(util.createTextNode('Link to a website')).to.eql({
        type: 'textnode',
        value: 'Link to a website'
      });
    });
  });

  describe('isTextNode', function() {
    it('should return true if a node is a text node', function() {
      expect(util.isTextNode({ type: 'textnode', value: 'text' })).to.eql(true);
    });

    it('should return false if a node is not a text node', function() {
      expect(
        util.isTextNode({ type: 'component', name: 'header', children: [] })
      ).to.eql(false);
    });
  });

  describe('isComponentNode', function() {
    it('should return true if a node is a component node', function() {
      expect(util.isComponentNode({ type: 'component', name: 'p' })).to.eql(
        true
      );
    });

    it('should return false if a node is not a component node', function() {
      expect(util.isComponentNode({ type: 'textnode', value: 'text' })).to.eql(
        false
      );
    });
  });

  describe('isVariableNode', function() {
    it('should return true if a node is a variable node', function() {
      expect(util.isVariableNode({ type: 'var', name: 'x', value: 2 })).to.eql(
        true
      );
      expect(
        util.isVariableNode({ type: 'derived', name: 'x', value: 2 })
      ).to.eql(true);
      expect(
        util.isVariableNode({ type: 'data', name: 'x', value: 'file.txt' })
      ).to.eql(true);
    });

    it('should return false if a node is not a variable node', function() {
      expect(util.isVariableNode({ type: 'textnode', value: 'text' })).to.eql(
        false
      );
    });
  });

  describe('isMetaNode', function() {
    it('should return true if a node is a meta node', function() {
      expect(util.isMetaNode({ type: 'meta' })).to.eql(true);
    });

    it('should return false if a node is not a meta node', function() {
      expect(util.isMetaNode({ type: 'textnode', value: 'text' })).to.eql(
        false
      );
    });
  });

  describe('getNodeName', function() {
    it('should return name if a node is a component node', function() {
      expect(util.getNodeName({ type: 'component', name: 'p' })).to.eql('p');
    });

    it('should return type if a node is not a component node', function() {
      expect(util.getNodeName({ type: 'textnode', value: 'text' })).to.eql(
        'textnode'
      );
    });
  });

  describe('getNodeType', function() {
    it('should return node type', function() {
      expect(util.getNodeType({ type: 'component', name: 'p' })).to.eql(
        'component'
      );
      expect(util.getNodeType({ type: 'textnode', value: 'text' })).to.eql(
        'textnode'
      );
    });
  });

  describe('hasChildren', function() {
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
  });

  describe('getChildren', function() {
    it('should get children of a node', function() {
      expect(util.getChildren(updatedASTWithNode())).to.eql(testChildren());
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
  });

  describe('setChildren', function() {
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
  });

  describe('appendChild', function() {
    it('should append child to an existing ast', function() {
      const ast = astTestVar();
      expect(util.appendChild(ast, createComponent())).to.eql(
        updatedASTWithNode()
      );
    });
  });

  describe('appendChildren', function() {
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
  });

  describe('prependChild', function() {
    it('should prepend child to an existing ast', function() {
      const ast = astTestVar();
      const test = updatedASTWithNode();
      test.children.reverse();
      expect(util.prependChild(ast, createComponent())).to.eql(test);
    });
  });

  describe('prependChildren', function() {
    it('should prepend multiple child nodes', function() {
      const ast = astTestVar();
      const test = updatedASTWithNodes();
      test.children.reverse();
      expect(
        util.prependChildren(ast, [createComponent(), createComponent()])
      ).to.eql(test);
    });

    it('should return original ast when empty array is prepended', function() {
      const ast = astTestVar();
      expect(util.prependChildren(ast, [])).to.eql(ast);
    });
  });

  describe('filterChildren', function() {
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
  });

  describe('mapChildren', function() {
    it('should map children of a passed node', function() {
      expect(
        util.mapChildren(updatedASTWithNode(), () => createComponent())
      ).to.eql(modifiedNode());
    });
  });

  describe('hasProperties', function() {
    it('should return true for component with properties', function() {
      expect(util.hasProperties(createAnchorNode())).to.eql(true);
    });

    it('should return false for component without properties', function() {
      expect(util.hasProperties({ type: 'textnode', value: 'text' })).to.eql(
        false
      );
    });

    it('should return false for component with empty properties object', function() {
      expect(
        util.hasProperties({ type: 'component', name: 'p', properties: {} })
      ).to.eql(false);
    });
  });

  describe('getProperties', function() {
    it('should return properties object', function() {
      const node = createAnchorNode();
      expect(util.getProperties(node)).to.eql(node.properties);
    });

    it('should return null if there are no properties', function() {
      const node = { type: 'textnode', value: 'text' };
      expect(util.getProperties(node)).to.eql(null);
    });
  });

  describe('setProperties', function() {
    it('should add properties to node', function() {
      const foo = { foo: { type: 'value', value: 1 } };
      const bar = { foo: { type: 'value', value: 2 } };
      const baz = { foo: { type: 'value', value: 3 } };
      const node = { type: 'component', name: 'p', properties: { foo } };

      expect(util.setProperties(node, { bar, baz }).properties).to.eql({
        foo,
        bar,
        baz
      });
    });
  });

  describe('clearProperties', function() {
    it('should remove all properties of a node', function() {
      const node = createAnchorNode();
      util.clearProperties(node);
      expect(util.getProperties(node)).to.eql(null);
    });
  });

  describe('getPropertyKeys', function() {
    it('should return property keys of a node', function() {
      expect(util.getPropertyKeys(createAnchorNode())).to.eql(['href']);
    });
  });

  describe('getPropertyType', function() {
    it('should return the type of a node property', function() {
      expect(util.getPropertyType(createAnchorNode(), 'href')).to.eql('value');
    });
  });

  describe('getPropertyValue', function() {
    it('should return the value of a node property', function() {
      expect(util.getPropertyValue(createAnchorNode(), 'href')).to.eql(
        'www.example.com'
      );
    });
  });

  describe('hasProperty', function() {
    it('should return true if a node has a property', function() {
      expect(util.hasProperty(createAnchorNode(), 'href')).to.be(true);
    });

    it('should return false if a node does not have a property', function() {
      expect(util.hasProperty(createAnchorNode(), 'foo')).to.be(false);
    });
  });

  describe('getProperty', function() {
    it('should return property data of a node', function() {
      expect(util.getProperty(createAnchorNode(), 'href')).to.eql({
        type: 'value',
        value: 'www.example.com'
      });
    });

    it('should return null if a property does not exist', function() {
      expect(util.getProperty(astTestVar(), 'name')).to.eql(null);
    });
  });

  describe('setProperty', function() {
    it('should set a property of a node', function() {
      const node = createComponentNode();
      util.setProperty(node, 'foo', { type: 'value', value: 'bar' });
      expect(util.getProperty(node, 'foo')).to.eql({
        type: 'value',
        value: 'bar'
      });
    });
  });

  describe('setValueProperty', function() {
    it('should set a value property of a node', function() {
      const node = createComponentNode();
      util.setValueProperty(node, 'foo', 'bar');
      expect(util.getProperty(node, 'foo')).to.eql({
        type: 'value',
        value: 'bar'
      });
    });
  });

  describe('setVariableProperty', function() {
    it('should set a variable property of a node', function() {
      const node = createComponentNode();
      util.setVariableProperty(node, 'foo', 'bar');
      expect(util.getProperty(node, 'foo')).to.eql({
        type: 'variable',
        value: 'bar'
      });
    });
  });

  describe('setExpressionProperty', function() {
    it('should set an expression property of a node', function() {
      const node = createComponentNode();
      util.setExpressionProperty(node, 'foo', 'bar + 1');
      expect(util.getProperty(node, 'foo')).to.eql({
        type: 'expression',
        value: 'bar + 1'
      });
    });
  });

  describe('removeProperty', function() {
    const node = createAnchorNode();
    util.removeProperty(node, 'href');
    expect(util.hasProperty(node, 'href')).to.eql(false);
  });

  describe('cloneNode', function() {
    const node = createAnchorNode();
    expect(util.cloneNode(node)).to.eql(node);
    expect(util.cloneNode(node) === node).to.be(false);
  });

  describe('visitNodes', function() {
    it('should modify nodes matching a query', function() {
      const ast = astTestVar();
      util.visitNodes(ast, node => {
        if (node.name === 'p') {
          node.name = 'paragraph';
        }
      });
      expect(ast).to.eql(paraNode());
    });
  });

  describe('queryNodes', function() {
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

    it('should find nodes based on a filter', function() {
      expect(
        util.queryNodes(astTestVar(), node => util.hasChildren(node)).length
      ).to.eql(7);
    });
  });

  describe('extractText', function() {
    it('should extract the text from the ast', function() {
      expect(util.extractText(astTestVar())).to.eql(
        'This is the first paragraph This is a header This is a link to a website'
      );
    });
  });
});
