const React = require('react');
const IdyllComponent = require('idyll-component');
const d3 = require('./lib/d3');
window.d3 = d3;
const VL = require('react-vega-lite').default;

class VegaLite extends IdyllComponent {
  render() {
    const data = {
      values: this.props.data
    };
    return (
      <VL {...this.props} data={data} />
    );
  }
}

module.exports = VegaLite;