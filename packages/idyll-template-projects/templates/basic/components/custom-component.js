const React = require('react');

class CustomComponent extends React.Component {
  render() {
    const { hasError, idyll, updateProps, ...props } = this.props;
    return (
      <div {...props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = CustomComponent;
