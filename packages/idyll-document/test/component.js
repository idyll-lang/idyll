import fs from 'fs';
import { join } from 'path';
import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import * as components from 'idyll-components';
import IdyllDocument from '../src/';

const fixture = f => fs.readFileSync(join(__dirname, `fixtures/${f}`), 'utf8');

describe('IdyllDocument', () => {
  let src, srcDoc, ast, astDoc;

  beforeEach(() => {
    src = fixture('src.idl');
    ast = JSON.parse(fixture('ast.json'));
    srcDoc = shallow(<IdyllDocument src={src} components={components} />);
    astDoc = shallow(<IdyllDocument ast={ast} components={components} />);
  });

  it('can be constructed with ast prop', () => {
    const doc = new IdyllDocument({ ast, components });
    expect(doc.props.ast).toBeDefined();
  });

  it('can be constructed with src prop', () => {
    const doc = new IdyllDocument({ src, components });
    expect(doc.props.src).toBeDefined();
  });

  // TODO: compare docs directly once Victory is deterministic
  it('treats src and ast props equivalently', () => {
    const header = <h1>Welcome to Idyll</h1>;
    const code = <code>[var name:"x" value:1 /]</code>;

    expect(srcDoc.contains(header)).toBe(true);
    expect(srcDoc.contains(code)).toBe(true);

    expect(astDoc.contains(header)).toBe(true);
    expect(astDoc.contains(code)).toBe(true);
  });

  it('wraps the right components', () => {
    expect(astDoc.find('Wrapper').length).toBe(7);
  });

  it('wraps both of the charts', () => {
    expect(srcDoc.find('Wrapper Chart').length).toBe(2);
  });
});
