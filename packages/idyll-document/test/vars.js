import React from 'react';

import * as components from 'idyll-components';
import InteractiveDocument from '../src/';
import ast from './fixtures/ast.json';

import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

let doc;
let component;

const FAKE_DATA = 'FAKE DATA';

beforeAll(() => {
  // doc = new InteractiveDocument({ast, components, datasets: {myData: FAKE_DATA}});
  component = mount(<InteractiveDocument ast={ast} components={components} datasets={{myData: FAKE_DATA}} />);
})

describe('Component state initialization', () => {
  it('creates the expected state', () => {
    expect(component.state()).toEqual({
      x: 2,
      frequency: 1,
      xSquared: 4,
      myData: FAKE_DATA
    });
  });

  it('creates the expected derived vars', () => {
    expect(component.instance().derivedVars).toEqual({
      xSquared: {
        value: 4,
        update: expect.any(Function)
      }
    });
  });

  it('can return the expected derived var values', () => {
    expect(component.instance().getDerivedVars()).toEqual({xSquared: 4});
  });

  it('renders expressions correctly before updates', () => {
    const displayComponents = component.findWhere((n) => {return n.type() === components.Display;});
    expect(displayComponents.length).toBeGreaterThan(2);

    const derivedDisplay = displayComponents.at(2);
    expect(derivedDisplay.html()).toBe('<span>4.00</span>');
  });

  it('can update the vars and derived vars', () => {
    const rangeComponents = component.findWhere((n) => {return n.type() === components.Range;});
    expect(rangeComponents.length).toBeGreaterThan(1);

    const updateProps = rangeComponents.first().prop('updateProps');
    expect(updateProps).toEqual(expect.any(Function));

    updateProps({ value: 4 });

    expect(component.instance().state).toEqual({
      x: 4,
      frequency: 1,
      xSquared: 16,
      myData: FAKE_DATA
    });
  });

  it('renders expressions correctly after updates', () => {
    const displayComponents = component.findWhere((n) => {return n.type() === components.Display;});
    expect(displayComponents.length).toBeGreaterThan(2);

    const derivedDisplay = displayComponents.at(2);
    expect(derivedDisplay.html()).toBe('<span>16.00</span>');
  });

});
