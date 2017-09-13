const React = require('react');

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

module.exports = Boolean;
