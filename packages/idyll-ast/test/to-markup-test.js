const expect = require('expect.js');
const util = require('../src');
const { astTestVar } = require('./test-data');

describe('toMarkup', function() {
  it('should convert a simple AST to markup', function() {
    const markup = util.toMarkup(astTestVar());
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

  it('should break a long set of component properties onto multiple lines', function() {
    const markup = util.toMarkup({
      type: 'component',
      name: 'div',
      children: [
        {
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
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'component',
          name: 'my-component',
          properties: {},
          children: []
        },
        {
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
        type: 'component',
        name: 'div',
        children: [
          {
            type: 'component',
            name: 'Header',
            properties: {}
          },
          {
            type: 'component',
            name: 'TextContainer',
            children: [
              {
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
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'component',
          name: 'my-component',
          properties: {},
          children: []
        },
        {
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
