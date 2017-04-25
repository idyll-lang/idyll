const React = require('react');
const IdyllComponent = require('idyll-component');
const InlineSVG = require('react-inlinesvg');

class SVG extends IdyllComponent {
  render() {
    return (
      <InlineSVG {...this.props} />
    );
  }
}

module.exports = SVG;

