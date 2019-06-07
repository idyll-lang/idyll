const React = require('react');

class Default extends React.Component {
  render() {
    const { idyll, ...props } = this.props;
    return <div>{props.children}</div>;
  }
}

Default._idyll = {
  name: 'Default',
  tagType: 'open',
  children: ['Some text'],
  props: []
};

export default Default;
