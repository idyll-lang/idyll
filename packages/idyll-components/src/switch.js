const React = require('react');
const { filterChildren } = require('idyll-component-children');

class Switch extends React.Component {
  render() {
    const {
      idyll,
      hasError,
      updateProps,
      value,
      children,
      ...props
    } = this.props;

    if (children) {
      const matchCase = child =>
        child.type.name.toLowerCase() === 'case' && child.props.test === value;
      const matchDefault = child => child.type.name.toLowerCase() === 'default';

      const matchedCase = filterChildren(children, matchCase);
      const defaultCase = filterChildren(children, matchDefault);

      return <div>{matchedCase.length ? matchedCase : defaultCase}</div>;
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
