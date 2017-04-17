import React from 'react';
import { mount, shallow } from 'enzyme';

import Analytics from '../src/components/analytics';
import Aside from '../src/components/aside';
import Boolean from '../src/components/boolean';
import Button from '../src/components/button';
import Chart from '../src/components/chart';
import DisplayVar from '../src/components/display-var';
import Dynamic from '../src/components/equation';
import Equation from '../src/components/equation';
import Fixed from '../src/components/fixed';
import Float from '../src/components/float';
import Gist from '../src/components/gist';
import Header from '../src/components/header';
import IdyllLogo from '../src/components/idyll-logo';
import Inline from '../src/components/inline';
import Link from '../src/components/link';
import Range from '../src/components/range';
import Slide from '../src/components/slide';
import Slideshow from '../src/components/slideshow';
import SVG from '../src/components/svg';
import Table from '../src/components/table';
// import VegaLite from '../src/components/vega-lite';

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
  it('<DisplayVar />', () => {
    const wrapper = shallow(<DisplayVar />);
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
  it('<IdyllLogo />', () => {
    const wrapper = shallow(<IdyllLogo />);
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
});
