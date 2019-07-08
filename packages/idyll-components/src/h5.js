import React from 'react';
import GenerateHeaders from './generateHeaders';

class H5 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="5" {...this.props} />;
  }
}

export default H5;
