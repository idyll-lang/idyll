import React from 'react';

class Action extends React.PureComponent {
  render() {
    return (
      <span {...this.props} className={'action'}>{this.props.children}</span>
    );
  }
}

export default Action;
