import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const { idyll, children, className, hasError, updateProps, ...props } = this.props;
    //const { styles, ...layout } = idyll.layout;
    //const { styles: _, ...theme } = idyll.theme;
   //const style = { ...layout, ...theme };
   //style = {style}
    const cn = (className || '') + ' idyll-text-container';
    return (
      <div  {...props} className={cn}>{children}</div>
    );
  }
}

export default TextContainer;
