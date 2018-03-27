import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const { idyll, children, className, hasError, updateProps, ...props } = this.props;
    const { styles, ...layout } = idyll.layout;
    const { styles: _, ...theme } = idyll.theme;
    const style = { ...layout, ...theme };
    const cn = (className || '') + ' idyll-text-container';
    return (
      <div style={style} {...props} className={cn}>{children}</div>
    );
  }
}

export default TextContainer;
