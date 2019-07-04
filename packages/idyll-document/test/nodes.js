import React from 'react';
import { shallow } from 'enzyme';
import * as components from 'idyll-components';

import IdyllDocument from '../src/';
import { translate, mapTree } from '../src/utils';
import ReactJsonSchema from '../src/utils/schema2element';
import ast from './fixtures/ast.json';
import schema from './fixtures/schema.json';

describe('AST to Schema', () => {
  it('converts from AST to schema expected by ReactJsonSchema', () => {
    expect(translate(ast)).toEqual(schema);
  });
});

describe('Schema transformations', () => {
  const source = [
    {
      component: 'p',
      children: [
        'This document is being rendered from ',
        {
          component: 'strong',
          children: ['Idyll markup']
        },
        '. If you’ve used ',
        {
          component: 'a',
          href: 'https://daringfireball.net/projects/markdown/',
          children: ['markdown']
        },
        ', Idyll should look pretty familiar, but it has some additional features. Write text in the box on the left and the output on the right will automatically update.'
      ]
    }
  ];

  it('can copy schema', () => {
    const d = mapTree(source, x => x);
    expect(d).toEqual(source);
  });

  it('can modify schema', () => {
    const modified = [
      {
        component: 'p',
        children: [
          'This document is being rendered from ',
          {
            component: 'wrapper',
            style: { color: 'red' },
            children: [
              {
                component: 'strong',
                children: ['Idyll markup']
              }
            ]
          },
          '. If you’ve used ',
          {
            component: 'a',
            href: 'https://daringfireball.net/projects/markdown/',
            children: ['markdown']
          },
          ', Idyll should look pretty familiar, but it has some additional features. Write text in the box on the left and the output on the right will automatically update.'
        ]
      }
    ];

    const d = mapTree(source, x => {
      if (x.component === 'strong') {
        return {
          component: 'wrapper',
          style: { color: 'red' },
          children: [x]
        };
      }
      return x;
    });

    expect(d).toEqual(modified);
  });
});

describe('Schema to Elements', () => {
  it('creates the expected elements', () => {
    const rjs = new ReactJsonSchema(components);

    // Remove the idyllASTNodes from this check
    const strippedSchema = mapTree(schema, c => {
      const { idyllASTNode, ...rest } = c;
      return rest;
    });

    const el = rjs.parseSchema({ component: 'div', children: strippedSchema });
    expect(
      shallow(el).contains(<components.H1>Welcome to Idyll</components.H1>)
    ).toBe(true);
  });
});
