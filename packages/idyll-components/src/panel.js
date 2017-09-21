
import React from 'react';
const ReactDOM = require('react-dom');

class Panel extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <div className="panel"  {...this.props} />;
  }

}

export default Panel;
