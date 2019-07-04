import React from 'react';
import { mount, shallow } from 'enzyme';
import * as components from 'idyll-components';

import ReactJsonSchema from '../src/utils/schema2element';
import schema from './fixtures/schema.json';

describe('ReactJsonSchema', () => {
  it('can be created without arguments', () => {
    const rjs = new ReactJsonSchema();
    expect(rjs).toBeDefined();
  });

  it('can accept a componentMap in the constructor', () => {
    const rjs = new ReactJsonSchema(components);
    expect(rjs.getComponentMap()).toBe(components);
  });

  it('can set the componentMap after the constructor', () => {
    const rjs = new ReactJsonSchema();
    rjs.setComponentMap(components);
    expect(rjs.getComponentMap()).toBe(components);
  });

  it('can parse a schema', () => {
    const rjs = new ReactJsonSchema(components);
    const tree = rjs.parseSchema({ component: 'div', children: schema });
    expect(shallow(tree)).toMatchSnapshot();
  });
});
