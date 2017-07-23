import React from 'react';
import { mount, shallow } from 'enzyme';

import Analytics from '../components/analytics';
import Aside from '../components/aside';
import Boolean from '../components/boolean';
import Button from '../components/button';
import Chart from '../components/chart';
import Display from '../components/display';
import Dynamic from '../components/equation';
import Equation from '../components/equation';
import Fixed from '../components/fixed';
import Float from '../components/float';
import Gist from '../components/gist';
import Header from '../components/header';
import Inline from '../components/inline';
import Link from '../components/link';
import Range from '../components/range';
import Slide from '../components/slide';
import Slideshow from '../components/slideshow';
import SVG from '../components/svg';
import Table from '../components/table';
// import VegaLite from '../components/vega-lite';

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
