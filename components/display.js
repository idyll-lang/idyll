const React = require('react');
const IdyllComponent = require('idyll-component');
const Format = require('d3-format');

class Display extends IdyllComponent {
  constructor(props) {
    super(props);
    this.format = Format.format(props.format || '0.2f');
  }

  render() {
    const { value } = this.props;
    return (
      <span>
        {typeof value === 'string' ? value : this.format(value)}
      </span>
    );
  }
}

module.exports = Display;
