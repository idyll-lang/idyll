import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import {
  Action,
  Analytics,
  Aside,
  Boolean,
  Button,
  Chart,
  CodeHighlight,
  Display,
  Dynamic,
  Equation,
  FeatureContent,
  Feature,
  Fixed,
  Float,
  FullScreen,
  Gist,
  Header,
  Inline,
  Link,
  Panel,
  Preload,
  Radio,
  Range,
  Select,
  Slide,
  Slideshow,
  SVG,
  Table,
  TextInput,
  Waypoint
} from '../src/';

import Container from '../src/utils/container';
import Screen from '../src/utils/screen';

describe('Sanity Check', () => {

  describe('Shallow Mount', () => {
    describe('Layout', () => {
      it('<Aside />', () => {
        expect(() => shallow(<Aside />)).not.toThrow();
      });
      it('<FeatureContent />', () => {
        expect(() => shallow(<FeatureContent />)).not.toThrow();
      });
      it('<Feature />', () => {
        expect(() => shallow(<Feature />)).not.toThrow();
      });
      it('<Fixed />', () => {
        expect(() => shallow(<Fixed />)).not.toThrow();
      });
      it('<Float />', () => {
        expect(() => shallow(<Float />)).not.toThrow();
      });
      it('<FullScreen />', () => {
        expect(() => shallow(<FullScreen />)).not.toThrow();
      });
      it('<Inline />', () => {
        expect(() => shallow(<Inline />)).not.toThrow();
      });
      it('<Panel />', () => {
        expect(() => shallow(<Panel />)).not.toThrow();
      });
      it('<Waypoint />', () => {
        expect(() => shallow(<Waypoint />)).not.toThrow();
      });
    })

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
      it('<Chart />', () => {
        expect(() => shallow(<Chart />)).not.toThrow();
      });
      it('<Display />', () => {
        expect(() => shallow(<Display />)).not.toThrow();
      });
      it('<Dynamic />', () => {
        expect(() => shallow(<Dynamic />)).not.toThrow();
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
      it('<Radio />', () => {
        expect(() => shallow(<Radio />)).not.toThrow();
      });
      it('<Range />', () => {
        expect(() => shallow(<Range />)).not.toThrow();
      });
      it('<Select />', () => {
        expect(() => shallow(<Select />)).not.toThrow();
      });
      it('<Slide />', () => {
        expect(() => shallow(<Slide />)).not.toThrow();
      });
      it('<Slideshow />', () => {
        expect(() => shallow(<Slideshow />)).not.toThrow();
      });
      it('<SVG />', () => {
        expect(() => shallow(<SVG />)).not.toThrow();
      });
      it('<Table />', () => {
        expect(() => shallow(<Table />)).not.toThrow();
      });
      it('<TextInput />', () => {
        expect(() => shallow(<TextInput />)).not.toThrow();
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        expect(() => shallow(<Analytics />)).not.toThrow();
      });
      it('<CodeHighlight />', () => {
        expect(() => shallow(<CodeHighlight />)).not.toThrow();
      });
      it('<Container />', () => {
        expect(() => shallow(<Container />)).not.toThrow();
      });
      it('<Preload />', () => {
        expect(() => shallow(<Preload />)).not.toThrow();
      });
      it('<Screen />', () => {
        expect(() => shallow(<Screen />)).not.toThrow();
      });
    });
  });


  describe('Full Mount', () => {
    describe('Layout', () => {
      it('<Aside />', () => {
        expect(() => mount(<Aside />)).not.toThrow();
      });
      it('<FeatureContent />', () => {
        expect(() => mount(<FeatureContent />)).not.toThrow();
      });
      it('<Feature />', () => {
        expect(() => mount(<Feature />)).not.toThrow();
      });
      it('<Fixed />', () => {
        expect(() => mount(<Fixed />)).not.toThrow();
      });
      it('<Float />', () => {
        expect(() => mount(<Float />)).not.toThrow();
      });
      it('<FullScreen />', () => {
        expect(() => mount(<FullScreen />)).not.toThrow();
      });
      it('<Inline />', () => {
        expect(() => mount(<Inline />)).not.toThrow();
      });
      it('<Panel />', () => {
        expect(() => mount(<Panel />)).not.toThrow();
      });
      it('<Waypoint />', () => {
        expect(() => mount(<Waypoint />)).not.toThrow();
      });
    })

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
      it('<Chart />', () => {
        expect(() => mount(<Chart />)).not.toThrow();
      });
      it('<Display />', () => {
        expect(() => mount(<Display />)).not.toThrow();
      });
      it('<Dynamic />', () => {
        expect(() => mount(<Dynamic />)).not.toThrow();
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
      it('<Radio />', () => {
        expect(() => mount(<Radio />)).not.toThrow();
      });
      it('<Range />', () => {
        expect(() => mount(<Range />)).not.toThrow();
      });
      it('<Select />', () => {
        expect(() => mount(<Select />)).not.toThrow();
      });
      it('<Slide />', () => {
        expect(() => mount(<Slide />)).not.toThrow();
      });
      it('<Slideshow />', () => {
        expect(() => mount(<Slideshow />)).not.toThrow();
      });
      it('<SVG />', () => {
        expect(() => mount(<SVG />)).not.toThrow();
      });
      it('<Table />', () => {
        expect(() => mount(<Table />)).not.toThrow();
      });
      it('<TextInput />', () => {
        expect(() => mount(<TextInput />)).not.toThrow();
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        expect(() => mount(<Analytics />)).not.toThrow();
      });
      it('<CodeHighlight />', () => {
        expect(() => mount(<CodeHighlight />)).not.toThrow();
      });
      it('<Container />', () => {
        expect(() => mount(<Container />)).not.toThrow();
      });
      it('<Preload />', () => {
        expect(() => mount(<Preload />)).not.toThrow();
      });
      it('<Screen />', () => {
        expect(() => mount(<Screen />)).not.toThrow();
      });
    });
  });
})
