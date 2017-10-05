import fs from 'fs';
import { join } from 'path';
import React from 'react';
import { mount, shallow } from 'enzyme';
import * as components from 'idyll-components';

import IdyllDocument from '../src/';

const fixture = f => fs.readFileSync(join(__dirname, `fixtures/${f}`), 'utf8');

describe('IdyllDocument', () => {
  let ast, astDoc;

  beforeEach(() => {
    ast = JSON.parse(fixture('ast.json'));
    astDoc = shallow(<IdyllDocument ast={ast} components={components} />);
  });

  it('can be constructed with ast prop', () => {
    const doc = new IdyllDocument({ ast, components });
    expect(doc.props.ast).toBeDefined();
  });

  it('wraps the right components', () => {
    expect(astDoc.find('Wrapper').length).toBe(13);
  });

  it('wraps both of the charts', () => {
    expect(astDoc.find('Wrapper Chart').length).toBe(2);
  });
});
