import React from 'react';

class CustomComponent extends React.PureComponent {
  render() {
    const { hasError, updateProps, idyll, ...props } = this.props;
    return <div {...props}>This is a custom component</div>;
  }
}

export default CustomComponent;

class IndexedComponent extends React.PureComponent {
  render() {
    const { hasError, updateProps, idyll, ...props } = this.props;
    return <div {...props}>This is another custom component</div>;
  }
}

export { IndexedComponent };
