import React from 'react';
import GenerateHeaders from './generateHeaders';

class H6 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="6">{children}</GenerateHeaders>;
  }
}

export default H6;
