const React = require('react');
const IdyllComponent = require('idyll-component');

class Fixed extends IdyllComponent {
  render() {
    return (
      <div style={{position: 'fixed'}} className="fixed">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Fixed;