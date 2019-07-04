import React from 'react';
import GenerateHeaders from './generateHeaders';

class H1 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="1">{children}</GenerateHeaders>;
  }
}

export default H1;
