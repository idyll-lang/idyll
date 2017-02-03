const React = require('react');
const IDLComponent = require('../idl-component');

class AngleDisplay extends IDLComponent {
  constructor(props) {
    super(props);
    this.defaultProps = {
      angle: 0,
      radius: 40
    };
  }

  handleClick() {
    this.updateProps({
      angle: this.props.angle + 10
    });
  }

  render() {
    const { radius, angle } = this.props;
    const radians = angle / 360 * 2 * Math.PI;
    
    return (
      <svg width={2 * radius + 10} height={2 * radius + 10} onClick={this.handleClick.bind(this)}>
        <circle cx={radius + 5} cy={radius + 5} r={radius} fill="none" stroke="black" />
        <line x1={radius + 5} y1={radius + 5} x2={5 + radius + radius * Math.cos(radians)} y2={5 + radius + radius * Math.sin(radians)} stroke="green" />
      </svg>
    )
  }
}

module.exports = AngleDisplay;