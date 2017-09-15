import React from 'react';

class Button extends React.PureComponent {
  render() {
    return (
      <button onClick={this.props.onClick.bind(this)}>
        {this.props.children}
      </button>
    );
  }
}

Button.defaultProps = {
  onClick: function() {}
};

export default Button;
