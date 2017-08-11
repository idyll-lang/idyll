import React from 'react';

import InteractiveDocument from '../../src/';
import ast from './ast.json'

describe('Component state initialization', () => {
  it('creates the expected state', () => {
    const doc = new InteractiveDocument({ast})
    expect(doc.state).toEqual({x: 2, frequency: 1});
  });

  it('creates the expected derived vars', () => {
    const doc = new InteractiveDocument({ast})
    expect(doc.getDerivedVars()).toEqual({xSquared: 4});
  });
});
