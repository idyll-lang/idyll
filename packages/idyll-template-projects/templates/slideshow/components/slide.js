import React from 'react';
import TextContainer from 'idyll-components/dist/cjs/text-container';

class Slide extends React.Component {
  render() {
    const { hasError, idyll, updateProps, children, ...props } = this.props;
    return (
      <div {...props} className="slide">
        <TextContainer idyll={idyll}>{children}</TextContainer>
      </div>
    );
  }
}

export default Slide;
