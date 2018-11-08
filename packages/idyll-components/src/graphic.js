const React = require('react');

class Graphic extends React.Component {
  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    return (
      <div {...props} />
    );
  }
}

Graphic._idyll = {
  name: "Graphic",
  tagType: "open"
}

module.exports = Graphic;
