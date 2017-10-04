import React from 'react';
const ReactDOM = require('react-dom');

class FeatureContent extends React.PureComponent {
  render () {
    return <div style={this.props.style}>
      {this.props.children}
    </div>
  }
}

export default FeatureContent;
