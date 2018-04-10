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

Inline._idyll = {
  name: "Inline",
  tagType: "open"
}


export default Inline;
