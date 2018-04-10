import React from 'react';

class Button extends React.PureComponent {
  render() {
    const { onClick, hasError, updateProps, ...props } = this.props;
    return (
      <button {...props} onClick={onClick.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

Button.defaultProps = {
  onClick: function() {}
};

Button._idyll = {
  name: "Button",
  tagType: "open",
  children: ['Click Me.'],
  props: [{
    name: "onClick",
    type: "event",
    example: "`x += 1`"
  }]
}
export default Button;
