const React = require('react');

class Action extends React.PureComponent {
  render() {
    return (
      <span {...this.props} className={'action'}>{this.props.children}</span>
    );
  }
}

module.exports = Action;
