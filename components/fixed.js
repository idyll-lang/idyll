const React = require('react');
const IDLComponent = require('../idl-component');

class Fixed extends IDLComponent {
  render() {
    return (
      <div style={{position: 'fixed'}} className="fixed">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Fixed;