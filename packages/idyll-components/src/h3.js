import React from 'react';
import GenerateHeaders from './generateHeaders';

class H3 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="3" {...this.props} />;
  }
}

H3._idyll = {
  name: 'H3',
  tagType: 'open',
  children: ['My Header Size 3']
};

export default H3;
