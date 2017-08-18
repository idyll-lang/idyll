import React from 'react';
import { shallow } from 'enzyme';
import componentClasses from 'idyll-components';

import IdyllDocument from '../src/';
import { translate } from '../src/utils'
import ReactJsonSchema from '../src/utils/schema2element';
import ast from './fixtures/ast.json'
import schema from './fixtures/schema.json'

describe('AST to Schema', () => {
  it('converts from AST to schema expected by ReactJsonSchema', () => {
    expect(translate(ast)).toEqual(schema)
  })
});

describe('Schema to Elements', () => {
  it('creates the expected elements', () => {
    const rjs = new ReactJsonSchema();
    rjs.setComponentMap(componentClasses);
    const el = rjs.parseSchema({component: 'div', children: schema});
    expect(shallow(el).contains(<h1>Welcome to Idyll</h1>)).toBe(true);
  });
});
