import React from 'react';
const ReactDOM = require('react-dom');
let id = 0;

class Radio extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.id = id++;
  }

  onChange(e) {
    this.props.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <div {...this.props}>
        {this.props.options.map((d) => {
          if (typeof d === 'string') {
            return <label><input type="radio" checked={d === this.props.value} onChange={this.onChange} value={d} name={this.id} />{d}</label>;
          }
          return <label><input type="radio" checked={d.value === this.props.value} onChange={this.onChange} value={d.value} name={this.id} />{d.label || d.value}</label>;
        })}
      </div>
    );
  }
}

Radio.defaultProps = {
  options: []
};


Radio._idyll = {
  name: "Radio",
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

export default Radio;
