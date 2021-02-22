import React from 'react';
import GenerateHeaders from './generateHeaders';

class H6 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="6" {...this.props} />;
  }
}

H6._idyll = {
  name: 'H6',
  tagType: 'open',
  children: ['My Header Size 6']
};

export default H6;
