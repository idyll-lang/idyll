const React = require('react');
const IdyllComponent = require('idyll-component');
const d3 = require('d3');
window.d3 = d3;
const VL = require('react-vega-lite').default;

class VegaLite extends IdyllComponent {
  componentShouldUpdate() {
    return false;
  }

  render() {
    return (
      <VL {...this.props} />
    );
  }
}

module.exports = VegaLite;