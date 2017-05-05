const React = require('react');
const IdyllComponent = require('idyll-component');

class Action extends IdyllComponent {
  render() {
    return (
      <span {...this.props} className={'action'}>{this.props.children}</span>
    );
  }
}

module.exports = Action;