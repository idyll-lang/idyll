import React from 'react';
import { mount, shallow } from 'enzyme';

import InteractiveDocument from '../src/';

describe('Component sanity check', () => {
  it('<InteractiveDocument />', () => {
    mount(<InteractiveDocument ast={[]} componentClasses={{}} datasets={{}} />);
  });
});
