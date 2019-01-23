import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const { idyll, children, className, hasError, updateProps, ...props } = this.props;
    const { styles, ...layout } = idyll.layout;
    const { styles: _, ...theme } = idyll.theme;
    const cn = (className || '') + ' idyll-text-container';
    return (
<<<<<<< HEAD
      <div  style = {style} {...props} className={cn}>{children}</div>
=======
      <div {...props} className={cn}>{children}</div>
>>>>>>> 3a99c28ffa4d4c4b726882db140c394e0abffec8
    );
  }
}


TextContainer._idyll = {
  name: "TextContainer",
  tagType: "open"
}
export default TextContainer;
