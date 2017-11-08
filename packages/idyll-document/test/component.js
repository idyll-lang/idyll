import fs from 'fs';
import { join } from 'path';
import React from 'react';
import { mount, shallow } from 'enzyme';
import compile from 'idyll-compiler'
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
    expect(astDoc.find('Wrapper').length).toBe(20);
  });

  it('wraps both of the charts', () => {
    expect(astDoc.find('Wrapper Chart').length).toBe(2);
  });
});

describe('Source to Doc', () => {
  it('can create a header', () => {
    const ast = compile('# A header');
    const doc = shallow(<IdyllDocument ast={ast} components={components} />);
    expect(doc).toBeDefined();
    expect(doc.find('h1').length).toBe(1);
  })

  it('can create an SVG', () => {
    const ast = compile('[SVG /]');
    const doc = shallow(<IdyllDocument ast={ast} components={components} />);
    expect(doc).toBeDefined();
    // underlying component is async so just make sure nothing blew up
  })
})
