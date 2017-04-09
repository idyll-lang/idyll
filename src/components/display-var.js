const React = require('react');
const IdyllComponent = require('idyll-component');

class DisplayVar extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>
        {this.props.var}
      </span>
    );
  }
}

module.exports = DisplayVar;
