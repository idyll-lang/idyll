import React from 'react';

class Inline extends React.PureComponent {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this.props.children}
      </div>
    );
  }
}

export default Inline;
