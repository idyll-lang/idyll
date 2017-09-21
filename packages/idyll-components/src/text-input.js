import React from 'react';
const ReactDOM = require('react-dom');

class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <input type="text" onChange={this.onChange} {...this.props} />
    );
  }
}

export default TextInput;
