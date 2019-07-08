import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  Action,
  Analytics,
  Aside,
  Boolean,
  Button,
  Chart,
  CodeHighlight,
  Case,
  Default,
  Display,
  Dynamic,
  Equation,
  Fixed,
  Float,
  Gist,
  Header,
  Inline,
  Link,
  Loop,
  Preload,
  Radio,
  Range,
  Select,
  Step,
  Stepper,
  SVG,
  Switch,
  Table,
  TextInput,
  Tweet,
  Youtube,
  Desmos
} from '../src/';

describe('Sanity Check', () => {
  describe('Shallow Mount', () => {
    describe('Layout', () => {
      it('<Aside />', () => {
        expect(() => shallow(<Aside />)).not.toThrow();
      });
      it('<Fixed />', () => {
        expect(() => shallow(<Fixed />)).not.toThrow();
      });
      it('<Float />', () => {
        expect(() => shallow(<Float />)).not.toThrow();
      });
      it('<Inline />', () => {
        expect(() => shallow(<Inline />)).not.toThrow();
      });
    });

    describe('Presentation', () => {
      it('<Action />', () => {
        expect(() => shallow(<Action />)).not.toThrow();
      });
      it('<Boolean />', () => {
        expect(() => shallow(<Boolean />)).not.toThrow();
      });
      it('<Button />', () => {
        expect(() => shallow(<Button />)).not.toThrow();
      });
      it('<Case />', () => {
        expect(() => shallow(<Case />)).not.toThrow();
      });
      it('<Chart />', () => {
        expect(() => shallow(<Chart />)).not.toThrow();
      });
      it('<Display />', () => {
        expect(() => shallow(<Display />)).not.toThrow();
      });
      it('<Dynamic />', () => {
        expect(() => shallow(<Dynamic />)).not.toThrow();
      });
      it('<Default />', () => {
        expect(() => shallow(<Default />)).not.toThrow();
      });
      it('<Equation />', () => {
        expect(() => shallow(<Equation />)).not.toThrow();
      });
      it('<Gist />', () => {
        expect(() => shallow(<Gist />)).not.toThrow();
      });
      it('<Header />', () => {
        expect(() => shallow(<Header />)).not.toThrow();
      });
      it('<Link />', () => {
        expect(() => shallow(<Link />)).not.toThrow();
      });
      it('<Loop />', () => {
        expect(() => shallow(<Loop />)).not.toThrow();
      });
      it('<Radio />', () => {
        expect(() => shallow(<Radio />)).not.toThrow();
      });
      it('<Range />', () => {
        expect(() => shallow(<Range />)).not.toThrow();
      });
      it('<Select />', () => {
        expect(() => shallow(<Select />)).not.toThrow();
      });
      it('<Step />', () => {
        expect(() => shallow(<Step />)).not.toThrow();
      });
      it('<Stepper />', () => {
        expect(() => shallow(<Stepper />)).not.toThrow();
      });
      it('<SVG />', () => {
        expect(() => shallow(<SVG />)).not.toThrow();
      });
      it('<Switch />', () => {
        expect(() => shallow(<Switch />)).not.toThrow();
      });
      it('<Table />', () => {
        expect(() => shallow(<Table />)).not.toThrow();
      });
      it('<TextInput />', () => {
        expect(() => shallow(<TextInput />)).not.toThrow();
      });
      it('<Desmos />', () => {
        expect(() => shallow(<Desmos />)).not.toThrow();
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        expect(() => shallow(<Analytics />)).not.toThrow();
      });
      it('<CodeHighlight />', () => {
        expect(() => shallow(<CodeHighlight />)).not.toThrow();
      });
      it('<Preload />', () => {
        expect(() => shallow(<Preload />)).not.toThrow();
      });
    });
  });

  describe('Full Mount', () => {
    describe('Layout', () => {
      it('<Aside />', () => {
        expect(() => mount(<Aside />)).not.toThrow();
      });
      it('<Fixed />', () => {
        expect(() => mount(<Fixed />)).not.toThrow();
      });
      it('<Float />', () => {
        expect(() => mount(<Float />)).not.toThrow();
      });
      it('<Inline />', () => {
        expect(() => mount(<Inline />)).not.toThrow();
      });
    });

    describe('Presentation', () => {
      it('<Action />', () => {
        expect(() => mount(<Action />)).not.toThrow();
      });
      it('<Boolean />', () => {
        expect(() => mount(<Boolean />)).not.toThrow();
      });
      it('<Button />', () => {
        expect(() => mount(<Button />)).not.toThrow();
      });
      it('<Case />', () => {
        expect(() => mount(<Case />)).not.toThrow();
      });
      it('<Chart />', () => {
        expect(() => mount(<Chart />)).not.toThrow();
      });
      it('<Display />', () => {
        expect(() => mount(<Display />)).not.toThrow();
      });
      it('<Dynamic />', () => {
        expect(() => mount(<Dynamic />)).not.toThrow();
      });
      it('<Default />', () => {
        expect(() => mount(<Default />)).not.toThrow();
      });
      it('<Equation />', () => {
        expect(() => mount(<Equation />)).not.toThrow();
      });
      it('<Gist />', () => {
        expect(() => mount(<Gist />)).not.toThrow();
      });
      it('<Header />', () => {
        expect(() => mount(<Header />)).not.toThrow();
      });
      it('<Link />', () => {
        expect(() => mount(<Link />)).not.toThrow();
      });
      it('<Loop />', () => {
        expect(() => mount(<Loop />)).not.toThrow();
      });
      it('<Radio />', () => {
        expect(() => mount(<Radio />)).not.toThrow();
      });
      it('<Range />', () => {
        expect(() => mount(<Range />)).not.toThrow();
      });
      it('<Select />', () => {
        expect(() => mount(<Select />)).not.toThrow();
      });
      it('<Step />', () => {
        expect(() => mount(<Step />)).not.toThrow();
      });
      it('<Stepper />', () => {
        expect(() => mount(<Stepper />)).not.toThrow();
      });
      it('<SVG />', () => {
        expect(() => mount(<SVG />)).not.toThrow();
      });
      it('<Switch />', () => {
        expect(() => mount(<Switch />)).not.toThrow();
      });
      it('<Table />', () => {
        expect(() => mount(<Table />)).not.toThrow();
      });
      it('<TextInput />', () => {
        expect(() => mount(<TextInput />)).not.toThrow();
      });
      it('<Tweet />', () => {
        expect(() => mount(<Tweet id="123" />)).not.toThrow();
      });
      it('<Youtube />', () => {
        expect(() => mount(<Youtube />)).not.toThrow();
      });
      it('<Desmos />', () => {
        expect(() => mount(<Desmos />)).not.toThrow();
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        expect(() => mount(<Analytics />)).not.toThrow();
      });
      it('<CodeHighlight />', () => {
        expect(() => mount(<CodeHighlight />)).not.toThrow();
      });
      it('<Preload />', () => {
        expect(() => mount(<Preload />)).not.toThrow();
      });
    });
  });
});
