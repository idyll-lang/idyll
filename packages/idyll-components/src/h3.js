import React from 'react';
import GenerateHeaders from './generateHeaders';

class H3 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="3" {...this.props} />;
  }
}

export default H3;
