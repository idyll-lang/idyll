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
    example: '"https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg"'
  }]
}

export default SVG;

