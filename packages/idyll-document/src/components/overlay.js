import React from 'react';

class Overlay extends React.PureComponent {

  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    // I believe it should be looking at the component that this overlay is within, and then
    // insert whatever icon on the top right of this component, let's say.
    return (
      <div class="overlay-div" {...props} />
    );
  }
}

module.exports = Overlay;