import React from 'react';
const ReactDOM = require('react-dom');

class Select extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <select onChange={this.onChange} {...this.props}>
        {this.props.options.map((d) => {
          if (typeof d === 'string') {
            return <option value={d}>{d}</option>;
          }
          return <option value={d.value}>{d.label || d.value}</option>;
        })}
      </select>
    );
  }
}

Select.defaultProps = {
  options: []
}

Select._idyll = {
  name: "Select",
  tagType: "closed",
  props: [{
    name: "value",
    type: "string",
    example: "x"
  }, {
    name: "options",
    type: "array",
    example: '`["option1", "option2"]`'
  }]
}
export default Select;
