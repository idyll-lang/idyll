import React from 'react';

class Fixed extends React.PureComponent {
  render() {
    return (
      <div style={{ position: 'fixed', ...this.props.style }} className="fixed">
        {this.props.children}
      </div>
    );
  }
}

Fixed._idyll = {
  name: 'Fixed',
  tagType: 'open',
  children: [
    'Content placed inside of a fixed component will be remain fixed in the margin.'
  ]
};

export default Fixed;
