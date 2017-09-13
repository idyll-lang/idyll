import React from 'react';
import { mount, shallow } from 'enzyme';

import Analytics from '../src/analytics';
import Aside from '../src/aside';
import Boolean from '../src/boolean';
import Button from '../src/button';
import Chart from '../src/chart';
import Display from '../src/display';
import Dynamic from '../src/equation';
import Equation from '../src/equation';
import Fixed from '../src/fixed';
import Float from '../src/float';
import Gist from '../src/gist';
import Header from '../src/header';
import Inline from '../src/inline';
import Link from '../src/link';
import Range from '../src/range';
import Slide from '../src/slide';
import Slideshow from '../src/slideshow';
import SVG from '../src/svg';
import Table from '../src/table';

describe('Components sanity check', () => {
  it('<Analytics />', () => {
    const wrapper = mount(<Aside />);
  });
  it('<Aside />', () => {
    const wrapper = shallow(<Aside />);
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
  it('<Fixed />', () => {
    const wrapper = shallow(<Fixed />);
  });
  it('<Float />', () => {
    const wrapper = shallow(<Float />);
  });
  it('<Gist />', () => {
    const wrapper = shallow(<Gist />);
  });
  it('<Header />', () => {
    const wrapper = shallow(<Header />);
  });
  it('<Inline />', () => {
    const wrapper = shallow(<Inline />);
  });
  it('<Link />', () => {
    const wrapper = shallow(<Link />);
  });
  it('<Range />', () => {
    const wrapper = shallow(<Range />);
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
  // it('<VegaLite />', () => {
  //   const wrapper = mount(<VegaLite />);
  // });
});
