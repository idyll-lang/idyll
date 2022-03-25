import React from 'react';

class TextContainer extends React.PureComponent {
  render() {
    const {
      idyll,
      children,
      className,
      hasError,
      updateProps,
      ...props
    } = this.props;

    const cn = (className || '') + ' idyll-text-container';
    return (
      <div {...props} className={cn}>
        {children}
      </div>
    );
  }
}

TextContainer._idyll = {
  name: 'TextContainer',
  tagType: 'open',
  children: ['This is my text.']
};

export default TextContainer;
