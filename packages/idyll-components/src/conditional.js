const React = require('react');

class Conditional extends React.Component {
  render() {
    const { idyll, hasError, updateProps, ...props } = this.props;

    if (!props.if) {
      return <div style={{display: 'none'}}>{props.children}</div>;
    }

    return <div>{props.children}</div>;
  }
}

module.exports = Conditional;
