import React from 'react';
const ReactDOM = require('react-dom');
const Format = require('d3-format');
const Drag = require('d3-drag');
const Selection = require('d3-selection');

class Dynamic extends React.PureComponent {

  componentDidMount() {
    let node;
    try {
      node = ReactDOM.findDOMNode(this);
    } catch(e) {};
    if (!node) {
      return;
    }
    this.drag = Drag.drag().on('drag', () => {
      const dx = Selection.event.dx;
      const { step, value, interval } = this.props;
      const newValue = Math.max(Math.min(value + (step || interval) * dx, this.props.max), this.props.min);
      this.props.updateProps({ value: newValue });
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
  step: 1
};


Dynamic._idyll = {
  name: "Dynamic",
  tagType: "closed",
  props: [{
    name: "value",
    type: "number",
    example: "x"
  }, {
    name: "step",
    type: "string",
    example: '1'
  }, {
    name: "min",
    type: "number",
    example: '-100'
  }, {
    name: "max",
    type: "number",
    example: '100'
  }]
}

export default Dynamic;
