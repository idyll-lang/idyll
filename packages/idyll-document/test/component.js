import React from 'react';
import { mount, shallow } from 'enzyme';
import * as components from 'idyll-components';

import IdyllDocument from '../src/';
import { translate } from '../src/utils'
import ReactJsonSchema from '../src/utils/schema2element';
import ast from './fixtures/ast.json'
import schema from './fixtures/schema.json'

describe('IdyllDocument', () => {
  it('creates an IdyllDocument', () => {
    expect(shallow(
      <IdyllDocument ast={ast} components={components} />
    ).contains(<h1>Welcome to Idyll</h1>)).toBe(true);
  });
});
