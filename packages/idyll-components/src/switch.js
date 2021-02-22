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

      return (
        <div style={props.style}>
          {matchedCase.length ? matchedCase : defaultCase}
        </div>
      );
    }
    return '';
  }
}

Switch._idyll = {
  name: 'Switch',
  tagType: 'open',
  children: [
    `
    [Case test:0]Case 0[/Case]
    [Case test:1]Case 1[/Case]
    [Default]Default case[/Default]
  `
  ],
  props: [
    {
      name: 'value',
      type: 'variable',
      example: 'x',
      description: 'Value of the child prop to render.'
    }
  ]
};

export default Switch;
