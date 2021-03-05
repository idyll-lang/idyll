const React = require('react');

class PascalComponent extends React.PureComponent {
  render() {
    const { hasError, updateProps, idyll, ...props } = this.props;

    return <div {...props}>This is a custom component</div>;
  }
}

module.exports = PascalComponent;
