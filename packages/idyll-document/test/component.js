const fs = require('fs');
const { join } = require('path');
const React = require('react');
const { mount, shallow } = require('enzyme');
const { compile } = require('idyll-compiler');
const components = require('idyll-components');

const { IdyllDocument } = require('../dist/cjs');

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
  it('can create a header', async () => {
    const ast = await compile('# A header');
    const doc = mount(<IdyllDocument ast={ast} components={components} />);
    expect(doc).toBeDefined();
    expect(doc.find('h1').length).toBe(1);
  });

  it('can create an SVG', async () => {
    const ast = await compile('[SVG /]');
    const doc = mount(<IdyllDocument ast={ast} components={components} />);
    expect(doc).toBeDefined();
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
