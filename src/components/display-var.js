const React = require('react');
const IdyllComponent = require('idyll-component');

class DisplayVar extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.var}
      </div>
    );
  }
}

module.exports = DisplayVar;
