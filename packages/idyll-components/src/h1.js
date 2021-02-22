import React from 'react';
import GenerateHeaders from './generateHeaders';

class H1 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="1" {...this.props} />;
  }
}

H1._idyll = {
  name: 'H1',
  tagType: 'open',
  children: ['My Header Size 1']
};

export default H1;
