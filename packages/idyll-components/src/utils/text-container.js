import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const { idyll, children, ...props } = this.props;
    return (
      <div style={{ maxWidth: idyll.theme.maxWidth }} {...props}>{this.props.children}</div>
    );
  }
}

export default TextContainer;
