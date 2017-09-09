const React = require('react');
const IdyllComponent = require('idyll-component');

class TextInput extends IdyllComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <input type="text" onChange={this.onChange} {...this.props} />
    );
  }
}

module.exports = TextInput;
