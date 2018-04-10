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


Fixed._idyll = {
  name: "Fixed",
  tagType: "open"
}

export default Fixed;
