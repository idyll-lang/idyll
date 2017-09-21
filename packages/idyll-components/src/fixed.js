import React from 'react';

class Fixed extends React.PureComponent {
  render() {
    return (
      <div style={{position: 'fixed'}} className="fixed">
        {this.props.children}
      </div>
    );
  }
}

export default Fixed;
