import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const { idyll, children, updateProps, ...props } = this.props;
    const { styles, ...layout } = idyll.layout;
    const { styles: _, ...theme } = idyll.theme;
    const style = { ...layout, ...theme };
    return (
      <div style={style} {...props}>{children}</div>
    );
  }
}

export default TextContainer;
