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

SVG._idyll = {
  name: "SVG",
  tagType: "closed",
  props: [{
    name: "src",
    type: "string",
    example: '"https://path/to/file.svg"'
  }]
}

export default SVG;

