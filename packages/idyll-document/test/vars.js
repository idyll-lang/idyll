import React from 'react';
import { shallow, mount } from 'enzyme';
import * as components from 'idyll-components';

import IdyllDocument from '../src/';
import ast from './fixtures/ast.json';

let component, idyllContext;

const FAKE_DATA = 'FAKE DATA';

beforeAll(() => {
  component = mount(
    <IdyllDocument
      ast={ast}
      components={components}
      datasets={{ myData: FAKE_DATA }}
      context={ctx => {
        idyllContext = ctx;
      }}
    />
  );
});

describe('Component state initialization', () => {
  it('creates the expected state', () => {
    expect(idyllContext.data()).toEqual({
      x: 2,
      frequency: 1,
      xSquared: 4,
      xCubed: 8,
      myData: FAKE_DATA,
      objectVar: { an: 'object' },
      arrayVar: ['array'],
      lateVar: 50,
      myAsyncJSONData: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      myAsyncCSVData: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
    });
  });

  // it('creates the expected derived vars', () => {
  //   expect(idyllContext.data().derivedVars).toEqual({
  //     xSquared: {
  //       value: 4,
  //       update: expect.any(Function)
  //     }
  //   });
  // });

  // it('can return the expected derived var values', () => {
  //   expect(idyllContext.data()).toEqual({xSquared: 4});
  // });

  it('renders expressions correctly before updates', () => {
    const displayComponents = component.findWhere(n => {
      return n.type() === components.Display;
    });
    expect(displayComponents.length).toBeGreaterThan(0);

    const checks = [
      {
        id: 'varDisplay',
        html: '<span class="idyll-display">2.00</span>'
      },
      {
        id: 'derivedVarDisplay',
        html: '<span class="idyll-display">4.00</span>'
      },
      {
        id: 'derivedVarDisplay2',
        html: '<span class="idyll-display">8.00</span>'
      },
      {
        id: 'strDisplay',
        html: '<span class="idyll-display">string</span>'
      },
      {
        id: 'staticObjectDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          static: 'object'
        })}</span>`
      },
      {
        id: 'dynamicObjectDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          dynamic: 2.0
        })}</span>`
      },
      {
        id: 'dataDisplay',
        html: `<span class="idyll-display">${FAKE_DATA}</span>`
      },
      {
        id: 'bareDataDisplay',
        html: `<span class="idyll-display">${FAKE_DATA}</span>`
      },
      {
        id: 'bareVarDisplay',
        html: '<span class="idyll-display">2.00</span>'
      },
      {
        id: 'bareDerivedDisplay',
        html: '<span class="idyll-display">4.00</span>'
      },
      {
        id: 'bareDerivedDisplay2',
        html: '<span class="idyll-display">8.00</span>'
      },
      {
        id: 'objectVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          an: 'object'
        })}</span>`
      },
      {
        id: 'bareObjectVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          an: 'object'
        })}</span>`
      },
      {
        id: 'arrayVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify(['array'])}</span>`
      },
      {
        id: 'bareArrayVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify(['array'])}</span>`
      }
    ];

    checks.forEach(check => {
      const display = displayComponents.find(`#${check.id}`);
      expect(display.length).toBe(1);
      expect(display.html()).toBe(check.html);
    });
  });

  it('handles custom initial state', () => {
    component = mount(
      <IdyllDocument
        ast={ast}
        initialState={{ x: 4 }}
        components={components}
        datasets={{ myData: FAKE_DATA }}
        context={ctx => (idyllContext = ctx)}
      />
    );

    expect(idyllContext.data()).toEqual({
      x: 4,
      frequency: 1,
      xSquared: 16,
      xCubed: 64,
      myData: FAKE_DATA,
      objectVar: { an: 'object' },
      arrayVar: ['array'],
      lateVar: 50,
      myAsyncJSONData: [],
      myAsyncCSVData: []
    });
  });

  it('can update the vars and derived vars', () => {
    const rangeComponents = component.findWhere(n => {
      return n.type() === components.Range;
    });
    expect(rangeComponents.length).toBeGreaterThan(1);

    const updateProps = rangeComponents.first().prop('updateProps');
    expect(updateProps).toEqual(expect.any(Function));

    idyllContext.onUpdate(newState => {
      expect(newState).toEqual({
        x: 8,
        xSquared: 64,
        xCubed: 512
      });
    });

    updateProps({ value: 8 });
    expect(idyllContext.data()).toEqual({
      x: 8,
      frequency: 1,
      xSquared: 64,
      xCubed: 512,
      myData: FAKE_DATA,
      objectVar: { an: 'object' },
      arrayVar: ['array'],
      lateVar: 50,
      myAsyncJSONData: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      myAsyncCSVData: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
    });
  });

  it('allows derived vars to reference other derived vars', () => {
    const rangeComponents = component.findWhere(n => {
      return n.type() === components.Range;
    });
    expect(rangeComponents.length).toBeGreaterThan(1);

    const updateProps = rangeComponents.first().prop('updateProps');
    expect(updateProps).toEqual(expect.any(Function));

    idyllContext.onUpdate(newState => {
      expect(newState).toEqual({
        x: 8,
        xSquared: 64,
        xCubed: 512
      });
    });

    updateProps({ value: 8 });
    expect(idyllContext.data()).toEqual({
      x: 8,
      frequency: 1,
      xSquared: 64,
      xCubed: 512,
      myData: FAKE_DATA,
      objectVar: { an: 'object' },
      arrayVar: ['array'],
      lateVar: 50,
      myAsyncJSONData: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      myAsyncCSVData: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
    });
  });

  it('renders expressions correctly after updates', () => {
    const displayComponents = component.findWhere(n => {
      return n.type() === components.Display;
    });
    expect(displayComponents.length).toBeGreaterThan(0);

    const checks = [
      {
        id: 'varDisplay',
        html: '<span class="idyll-display">8.00</span>'
      },
      {
        id: 'derivedVarDisplay',
        html: '<span class="idyll-display">64.00</span>'
      },
      {
        id: 'derivedVarDisplay2',
        html: '<span class="idyll-display">512.00</span>'
      },
      {
        id: 'strDisplay',
        html: '<span class="idyll-display">string</span>'
      },
      {
        id: 'staticObjectDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          static: 'object'
        })}</span>`
      },
      {
        id: 'dynamicObjectDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          dynamic: 8.0
        })}</span>`
      },
      {
        id: 'dataDisplay',
        html: `<span class="idyll-display">${FAKE_DATA}</span>`
      },
      {
        id: 'bareDataDisplay',
        html: `<span class="idyll-display">${FAKE_DATA}</span>`
      },
      {
        id: 'bareDerivedDisplay',
        html: '<span class="idyll-display">64.00</span>'
      },
      {
        id: 'bareDerivedDisplay2',
        html: '<span class="idyll-display">512.00</span>'
      },
      {
        id: 'bareVarDisplay',
        html: '<span class="idyll-display">8.00</span>'
      },
      {
        id: 'objectVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          an: 'object'
        })}</span>`
      },
      {
        id: 'bareObjectVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify({
          an: 'object'
        })}</span>`
      },
      {
        id: 'arrayVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify(['array'])}</span>`
      },
      {
        id: 'bareArrayVarDisplay',
        html: `<span class="idyll-display">${JSON.stringify(['array'])}</span>`
      },
      {
        id: 'lateVarDisplay',
        html: `<span class="idyll-display">50.00</span>`
      }
    ];

    checks.forEach(check => {
      const display = displayComponents.find(`#${check.id}`);
      expect(display.length).toBe(1);
      expect(display.html()).toBe(check.html);
    });
  });
});
