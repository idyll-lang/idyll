const React = require('react');
const IdyllComponent = require('idyll-component');

class Range extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.updateProps({
      value: +event.target.value
    });
  }

  render() {
    const { value, min, max, step } = this.props;
    return (
      <input type="range" onChange={this.handleChange.bind(this)} value={value} min={min} max={max} step={step} />
    );
  }
}

Range.defaultProps = {
  value: 0,
  min: 0,
  max: 1,
  step: 1
};

module.exports = Range;