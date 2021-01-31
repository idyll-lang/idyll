import React from 'react';

class Aside extends React.PureComponent {
  render() {
    return (
      <span style={this.props.style} className={'aside-container'}>
        <span className={'aside'}>{this.props.children}</span>
      </span>
    );
  }
}

Aside._idyll = {
  name: 'Aside',
  tagType: 'open'
};

export default Aside;
