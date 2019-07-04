import fs from 'fs';
import { join } from 'path';
import React from 'react';
import { mount, shallow } from 'enzyme';
import compile from 'idyll-compiler';
import * as components from 'idyll-components';

import IdyllDocument from '../src/';

const fixture = f => fs.readFileSync(join(__dirname, `fixtures/${f}`), 'utf8');

describe('IdyllDocument', () => {
  let ast, astDoc;

  beforeEach(() => {
    ast = JSON.parse(fixture('ast.json'));
    astDoc = mount(<IdyllDocument ast={ast} components={components} />);
  });

  it('can be constructed with ast prop', () => {
    const doc = new IdyllDocument({ ast, components });
    expect(doc.props.ast).toBeDefined();
  });

  it('wraps the right components', () => {
    expect(astDoc.find('Wrapper').length).toBe(29);
  });

  it('wraps both of the charts', () => {
    expect(astDoc.find('Wrapper Chart').length).toBe(2);
  });
});

describe('Source to Doc', () => {
  it('can create a header', done => {
    compile('# A header').then(ast => {
      const doc = mount(<IdyllDocument ast={ast} components={components} />);
      expect(doc).toBeDefined();
      expect(doc.find('h1').length).toBe(1);
      done();
    });
  });

  it('can create an SVG', done => {
    compile('[SVG /]').then(ast => {
      const doc = mount(<IdyllDocument ast={ast} components={components} />);
      expect(doc).toBeDefined();
      done();
    });
  });

  it('works with markup instead of an AST', done => {
    const doc = mount(
      <IdyllDocument markup={'# A header'} components={components} />
    );

    setTimeout(() => {
      doc.update();
      expect(doc).toBeDefined();
      expect(doc.find('h1').length).toBe(1);
      done();
    }, 100);
  });
});
