import React from 'react';
import ReactDOM from 'react-dom/server';
import renderer from 'react-test-renderer'
import componentClasses from 'idyll-components';
import { mount, shallow } from 'enzyme';

import IdyllDocument from '../src/';
import { splitAST, translate } from '../src/utils'
import ReactJsonSchema from '../src/utils/schema2element';
import ast from './fixtures/ast.json'
import schema from './fixtures/schema.json'

describe('Component state initialization', () => {
  it('converts from one schema to another', () => {
    expect(translate(splitAST(ast).elements)).toEqual(schema)
  })

  it('creates the expected elements', () => {
    const rjs = new ReactJsonSchema();
    rjs.setComponentMap(componentClasses);
    const el = rjs.parseSchema({component: "div", children: schema});
    expect(shallow(el).html()).toBeDefined();
  });
});
