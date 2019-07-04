import React from 'react';
import GenerateHeaders from './generateHeaders';

class H3 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="3">{children}</GenerateHeaders>;
  }
}

export default H3;
