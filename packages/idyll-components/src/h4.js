import React from 'react';
import GenerateHeaders from './generateHeaders';

class H4 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="4">{children}</GenerateHeaders>;
  }
}

export default H4;
