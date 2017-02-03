const React = require('react');
const IdyllComponent = require('idyll-component');

class Button extends IdyllComponent {
  render() {
    return (
      <button onClick={this.props.onClick.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

module.exports = Button;
