const React = require('react');

class PascalComponent extends React.PureComponent {
  render() {
    return (
      <div {...this.props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = PascalComponent;
