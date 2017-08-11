const React = require('react');
const IdyllComponent = require('idyll-component');

class PascalComponent extends IdyllComponent {
  render() {
    return (
      <div {...this.props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = PascalComponent;
