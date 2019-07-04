import React from 'react';
import GenerateHeaders from './generateHeaders';

class H2 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="2">{children}</GenerateHeaders>;
  }
}

export default H2;
