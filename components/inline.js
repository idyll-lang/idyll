const React = require('react');
const IDLComponent = require('../idl-component');

class Inline extends IDLComponent {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Inline;