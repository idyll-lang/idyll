import React from 'react';
const InlineSVG = require('react-inlinesvg');

class SVG extends React.PureComponent {
  render() {
    return (
      <InlineSVG {...this.props} />
    );
  }
}

export default SVG;

