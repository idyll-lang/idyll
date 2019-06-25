import React from 'react';

class Heading1 extends React.PureComponent {
  render() {
    const { children, id } = this.props;
    if (children && !id) {
      let generatedId = children
        .toString()
        .replace(/\s+/g, '-')
        .toLowerCase();
      return <h1 id={generatedId}>{children}</h1>;
    } else if (children && id) {
      return <h1 id={id}>{children}</h1>;
    } else {
      return null;
    }
  }
}

Heading1._idyll = {
  name: 'Heading1',
  tagType: 'open',
  children: ['My Header'],
  props: [
    {
      name: 'id',
      type: 'string',
      example: '"my-id"',
      description: 'attach id attribute to header'
    }
  ]
};

export default Heading1;
