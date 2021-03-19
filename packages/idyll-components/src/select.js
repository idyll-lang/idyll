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
    const { idyll, hasError, updateProps, ...props } = this.props;
    return (
      <select
        onChange={this.onChange}
        {...props}
        onClick={this.props.onClick || (e => e.stopPropagation())}
      >
        {this.props.options.map(d => {
          if (typeof d === 'string') {
            return (
              <option key={d} value={d}>
                {d}
              </option>
            );
          }
          return (
            <option key={d.label || d.value} value={d.value}>
              {d.label || d.value}
            </option>
          );
        })}
      </select>
    );
  }
}

Select.defaultProps = {
  options: []
};

Select._idyll = {
  name: 'Select',
  tagType: 'closed',
  props: [
    {
      name: 'value',
      type: 'string',
      example: 'x',
      description: 'The currently selected value.'
    },
    {
      name: 'options',
      type: 'array',
      example: '`["option1", "option2"]`',
      description:
        'An array representing the different options. Can be an array of strings like `["val1", "val2"]` or an array of objects `[{ value: "val1", label: "Value 1" }, { value: "val2", label: "Value 2" }]`.'
    }
  ]
};
export default Select;
