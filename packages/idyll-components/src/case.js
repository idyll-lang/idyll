const React = require('react');

class Case extends React.Component {
  render() {
    const { idyll, ...props } = this.props;
    return <div>{props.children}</div>;
  }
}

Case._idyll = {
  name: 'Case',
  tagType: 'open',
  children: ['Some text'],
  props: [
    {
      name: 'test',
      type: 'value',
      example: '1',
      description:
        'A variable; if this is equal to the parent [Switch /] components value, the children for this case will be rendered, otherwise the default case will be rendered.'
    }
  ]
};

export default Case;
