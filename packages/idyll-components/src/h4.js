import React from 'react';
import GenerateHeaders from './generateHeaders';

class H4 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="4" {...this.props} />;
  }
}

export default H4;
