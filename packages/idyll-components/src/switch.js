const React = require('react');

class Switch extends React.Component {
  render() {
    const { idyll, hasError, updateProps, value, ...props } = this.props;

    if (props.children) {
      const filterFn = value => ({ props }) =>
        props.children[0].props.test === value;
      const matchCase = filterFn(value);
      const matchDefault = filterFn('Default');
      const [matchedCase] = props.children.filter(matchCase);
      const [DefaultCase] = props.children.filter(matchDefault);
      return <div>{matchedCase ? matchedCase : DefaultCase}</div>;
    }
    return '';
  }
}

Switch._idyll = {
  name: 'Switch',
  tagType: 'open',
  children: ['Case components'],
  props: [
    {
      name: 'value',
      type: 'variable',
      example: '1',
      description: 'Value of the child prop to render.'
    }
  ]
};

export default Switch;
