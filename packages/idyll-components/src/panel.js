
import React from 'react';
const ReactDOM = require('react-dom');

class Panel extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    const { updateProps, hasError, ...props } = this.props;
    return <div className="panel" {...props} />;
  }

}

export default Panel;
