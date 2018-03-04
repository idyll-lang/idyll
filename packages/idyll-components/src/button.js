import React from 'react';

class Button extends React.PureComponent {
  render() {
    return (
      <button {...this.props} onClick={this.props.onClick.bind(this)} />
    );
  }
}

Button.defaultProps = {
  onClick: function() {}
};

export default Button;
