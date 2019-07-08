import React from 'react';
import GenerateHeaders from './generateHeaders';

class H1 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="1" {...this.props} />;
  }
}

export default H1;
