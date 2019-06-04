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
      type: 'variable',
      example: '1',
      description:
        'A variable; if this is equal to the parent [Switch /] components value, the children for this case will be rendered, otherwise nothing will be drawn to the screen'
    }
  ]
};

export default Case;
