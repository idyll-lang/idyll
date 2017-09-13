const React = require('react');
const InlineSVG = require('react-inlinesvg');

class SVG extends React.PureComponent {
  render() {
    return (
      <InlineSVG {...this.props} />
    );
  }
}

module.exports = SVG;

