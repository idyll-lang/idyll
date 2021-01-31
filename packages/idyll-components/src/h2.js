import React from 'react';
import GenerateHeaders from './generateHeaders';

class H2 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="2" {...this.props} />;
  }
}

H2._idyll = {
  name: 'H2',
  tagType: 'open',
  children: ['My Header Size 2']
};

export default H2;
