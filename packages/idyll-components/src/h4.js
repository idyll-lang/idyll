import React from 'react';
import GenerateHeaders from './generateHeaders';

class H4 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="4" {...this.props} />;
  }
}

H4._idyll = {
  name: 'H4',
  tagType: 'open',
  children: ['My Header Size 4']
};

export default H4;
