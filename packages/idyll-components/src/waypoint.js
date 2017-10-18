import React from 'react';
import ReactDOM from 'react-dom';
import Screen from './utils/screen';

class Waypoint extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen align="center" direction="row" height="75vh" {...this.props} />;
  }

}

export default Waypoint;
