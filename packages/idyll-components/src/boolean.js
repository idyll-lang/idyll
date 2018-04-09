import React from 'react';

class Boolean extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  toggleCheckbox() {
    this.props.updateProps({
      value: !this.props.value
    });
  }

  render() {
    const { value } = this.props;
    return (
      <input type="checkbox" onChange={this.toggleCheckbox.bind(this)} value={value} />
    );
  }
}

Boolean.defaultProps = {
  value: false
};


Boolean._idyll = {
  name: "Boolean",
  tagType: "closed",
  props: [{
    name: "value",
    type: "boolean",
    example: "x"
  }]
}

export default Boolean;
