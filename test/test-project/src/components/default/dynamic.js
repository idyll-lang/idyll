const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Format = require('d3-format');
const Drag = require('d3-drag');
const Selection = require('d3-selection');

class Dynamic extends IdyllComponent {

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.drag = Drag.drag().on('drag', () => {
      const dx = Selection.event.dx;
      const { interval, value } = this.props;
      const newValue = Math.max(Math.min(value + interval * dx, this.props.max), this.props.min);
      this.updateProps({ value: newValue });
    });
    this.drag(Selection.select(node));
  }

  render() {
    const { format, value } = this.props;
    const formatter = Format.format(format);
    return (
      <span className="idyll-dynamic">
        {formatter(value)}
      </span>
    );
  }
}

Dynamic.defaultProps = {
  format: '.2f',
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  interval: 1
};

module.exports = Dynamic;
