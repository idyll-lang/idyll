import React from 'react';

import * as components from 'idyll-components';
import InteractiveDocument from '../src/';
import ast from './fixtures/ast.json'

let doc;

beforeEach(() => {
  doc = new InteractiveDocument({ast, components, datasets: {myData: 'FAKE DATA'}});
})

describe('Component state initialization', () => {
  it('creates the expected state', () => {
    expect(doc.state).toEqual({
      x: 2,
      frequency: 1,
      xSquared: 4,
      myData: 'FAKE DATA'
    });
  });

  it('creates the expected derived vars', () => {
    expect(doc.derivedVars).toEqual({
      xSquared: {
        value: 4,
        update: expect.any(Function)
      }
    });
  });

  it('can return the expected derived var values', () => {
    expect(doc.getDerivedVars()).toEqual({xSquared: 4});
  });

  it('can update the derived vars', () => {
    doc.updateDerivedVars({x: 4, frequency: 5});
    expect(doc.getDerivedVars()).toEqual({xSquared: 16});
  });
});
