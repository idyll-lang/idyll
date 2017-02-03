const React = require('react');
const IDLComponent = require('../idl-component');

class Button extends IDLComponent {
  render() {
    return (
      <button onClick={this.props.onClick.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

module.exports = Button;
