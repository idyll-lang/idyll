const React = require('react');
const IdyllComponent = require('idyll-component');

class Boolean extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  toggleCheckbox() {
    this.updateProps({
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

module.exports = Boolean;