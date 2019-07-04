import React from 'react';
import GenerateHeaders from './generateHeaders';

class H5 extends React.PureComponent {
  render() {
    const { children } = this.props;
    return <GenerateHeaders size="5">{children}</GenerateHeaders>;
  }
}

export default H5;
