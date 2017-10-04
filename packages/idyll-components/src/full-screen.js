
import React from 'react';
import ReactDOM from 'react-dom';
import Screen from './utils/screen';

class FullScreen extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen fullBleed={true} align="stretch"  {...this.props} />;
  }

}

export default FullScreen;
