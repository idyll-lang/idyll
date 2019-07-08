import React from 'react';
import GenerateHeaders from './generateHeaders';

class H6 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="6" {...this.props} />;
  }
}

export default H6;
