const React = require('react');
const IdyllComponent = require('idyll-component');

class Inline extends IdyllComponent {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Inline;