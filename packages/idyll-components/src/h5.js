import React from 'react';
import GenerateHeaders from './generateHeaders';

class H5 extends React.PureComponent {
  render() {
    return <GenerateHeaders size="5" {...this.props} />;
  }
}

H5._idyll = {
  name: 'H5',
  tagType: 'open',
  children: ['My Header Size 5']
};

export default H5;
