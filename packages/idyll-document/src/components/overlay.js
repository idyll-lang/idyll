import React from 'react';

class Overlay extends React.PureComponent {

  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    return (
      <div className="overlay-div" {...props} />
    );
  }
}

module.exports = Overlay;