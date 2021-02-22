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
  tagType: 'open'
};

export default Fixed;
