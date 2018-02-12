import React from 'react';
import InlineSVG from 'react-inlinesvg';

class SVG extends React.PureComponent {
  render() {
    return (
      <InlineSVG {...this.props} />
    );
  }
}

SVG.defaultProps = {
  src: ''
}

export default SVG;

