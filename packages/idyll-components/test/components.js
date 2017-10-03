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
        const wrapper = shallow(<Aside />);
      });
      it('<FeatureContent />', () => {
        const wrapper = shallow(<FeatureContent />);
      });
      it('<Feature />', () => {
        const wrapper = shallow(<Feature />);
      });
      it('<Fixed />', () => {
        const wrapper = shallow(<Fixed />);
      });
      it('<Float />', () => {
        const wrapper = shallow(<Float />);
      });
      it('<FullScreen />', () => {
        const wrapper = shallow(<FullScreen />);
      });
      it('<Inline />', () => {
        const wrapper = shallow(<Inline />);
      });
      it('<Panel />', () => {
        const wrapper = shallow(<Panel />);
      });
      it('<Waypoint />', () => {
        const wrapper = shallow(<Waypoint />);
      });
    })

    describe('Presentation', () => {
      it('<Action />', () => {
        const wrapper = shallow(<Action />);
      });
      it('<Boolean />', () => {
        const wrapper = shallow(<Boolean />);
      });
      it('<Button />', () => {
        const wrapper = shallow(<Button />);
      });
      it('<Chart />', () => {
        const wrapper = shallow(<Chart />);
      });
      it('<Display />', () => {
        const wrapper = shallow(<Display />);
      });
      it('<Dynamic />', () => {
        const wrapper = shallow(<Dynamic />);
      });
      it('<Equation />', () => {
        const wrapper = shallow(<Equation />);
      });
      it('<Gist />', () => {
        const wrapper = shallow(<Gist />);
      });
      it('<Header />', () => {
        const wrapper = shallow(<Header />);
      });
      it('<Link />', () => {
        const wrapper = shallow(<Link />);
      });
      it('<Radio />', () => {
        const wrapper = shallow(<Radio />);
      });
      it('<Range />', () => {
        const wrapper = shallow(<Range />);
      });
      it('<Select />', () => {
        const wrapper = shallow(<Select />);
      });
      it('<Slide />', () => {
        const wrapper = shallow(<Slide />);
      });
      it('<Slideshow />', () => {
        const wrapper = shallow(<Slideshow />);
      });
      it('<SVG />', () => {
        const wrapper = shallow(<SVG />);
      });
      it('<Table />', () => {
        const wrapper = shallow(<Table />);
      });
      it('<TextInput />', () => {
        const wrapper = shallow(<TextInput />);
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        const wrapper = mount(<Analytics />);
      });
      it('<CodeHighlight />', () => {
        const wrapper = mount(<CodeHighlight />);
      });
      it('<Container />', () => {
        const wrapper = mount(<Container />);
      });
      it('<Preload />', () => {
        const wrapper = mount(<Preload />);
      });
      it('<Screen />', () => {
        const wrapper = mount(<Screen />);
      });
    });
  });


  describe('Full Mount', () => {
    describe('Layout', () => {
      it('<Aside />', () => {
        const wrapper = mount(<Aside />);
      });
      it('<FeatureContent />', () => {
        const wrapper = mount(<FeatureContent />);
      });
      it('<Feature />', () => {
        const wrapper = mount(<Feature />);
      });
      it('<Fixed />', () => {
        const wrapper = mount(<Fixed />);
      });
      it('<Float />', () => {
        const wrapper = mount(<Float />);
      });
      it('<FullScreen />', () => {
        const wrapper = mount(<FullScreen />);
      });
      it('<Inline />', () => {
        const wrapper = mount(<Inline />);
      });
      it('<Panel />', () => {
        const wrapper = mount(<Panel />);
      });
      it('<Waypoint />', () => {
        const wrapper = mount(<Waypoint />);
      });
    })

    describe('Presentation', () => {
      it('<Action />', () => {
        const wrapper = mount(<Action />);
      });
      it('<Boolean />', () => {
        const wrapper = mount(<Boolean />);
      });
      it('<Button />', () => {
        const wrapper = mount(<Button />);
      });
      it('<Chart />', () => {
        const wrapper = mount(<Chart />);
      });
      it('<Display />', () => {
        const wrapper = mount(<Display />);
      });
      it('<Dynamic />', () => {
        const wrapper = mount(<Dynamic />);
      });
      it('<Equation />', () => {
        const wrapper = mount(<Equation />);
      });
      it('<Gist />', () => {
        const wrapper = mount(<Gist />);
      });
      it('<Header />', () => {
        const wrapper = mount(<Header />);
      });
      it('<Link />', () => {
        const wrapper = mount(<Link />);
      });
      it('<Radio />', () => {
        const wrapper = mount(<Radio />);
      });
      it('<Range />', () => {
        const wrapper = mount(<Range />);
      });
      it('<Select />', () => {
        const wrapper = mount(<Select />);
      });
      it('<Slide />', () => {
        const wrapper = mount(<Slide />);
      });
      it('<Slideshow />', () => {
        const wrapper = mount(<Slideshow />);
      });
      it('<SVG />', () => {
        const wrapper = mount(<SVG />);
      });
      it('<Table />', () => {
        const wrapper = mount(<Table />);
      });
      it('<TextInput />', () => {
        const wrapper = mount(<TextInput />);
      });
    });

    describe('Helpers', () => {
      it('<Analytics />', () => {
        const wrapper = mount(<Analytics />);
      });
      it('<CodeHighlight />', () => {
        const wrapper = mount(<CodeHighlight />);
      });
      it('<Container />', () => {
        const wrapper = mount(<Container />);
      });
      it('<Preload />', () => {
        const wrapper = mount(<Preload />);
      });
      it('<Screen />', () => {
        const wrapper = mount(<Screen />);
      });
    });
  });
})
