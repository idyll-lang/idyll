const React = require('react');

class CustomComponent extends React.PureComponent {
  render() {
    const {hasError, updateProps, ...props} = this.props;
    return (
      <div {...props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = CustomComponent;

module.exports.IndexedComponent = class extends React.PureComponent {
  render() {
    const {hasError, updateProps, ...props} = this.props;
    return (
      <div {...props}>
        This is another custom component
      </div>
    );
  }
};
