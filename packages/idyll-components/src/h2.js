import React from 'react';
import GenerateHeaders from './generateHeaders';

class H2 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="2" {...this.props} />;
  }
}

export default H2;
