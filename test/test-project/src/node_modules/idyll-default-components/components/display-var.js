const React = require('react');
const IdyllComponent = require('idyll-component');
const Format = require('d3-format');

class DisplayVar extends IdyllComponent {
  constructor(props) {
    super(props);
    this.format = Format.format(props.format || '0.2f');
  }

  render() {
    return (
      <span>
        {this.format(this.props.var)}
      </span>
    );
  }
}

module.exports = DisplayVar;
