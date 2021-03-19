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
    } catch (e) {}
    if (!node) {
      return;
    }
    this.drag = Drag.drag().on('drag', () => {
      const dx = Selection.event.dx;
      const { step, value, interval } = this.props;
      const newValue = Math.max(
        Math.min(value + (step || interval) * dx, this.props.max),
        this.props.min
      );
      this.props.updateProps({ value: newValue });
    });
    this.drag(Selection.select(node));
  }

  transformValue() {
    const { format, value, display } = this.props;
    const formatter = Format.format(format);
    if (display !== undefined) {
      if (typeof display === 'string') {
        return display;
      }
      return formatter(display);
    }
    return formatter(value);
  }

  render() {
    const display = this.transformValue();
    return (
      <span
        onClick={this.props.onClick || (e => e.stopPropagation())}
        style={this.props.style}
        className="idyll-dynamic"
      >
        {display}
      </span>
    );
  }
}

Dynamic.defaultProps = {
  format: '.2f',
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  interval: 0,
  display: undefined
};

Dynamic._idyll = {
  name: 'Dynamic',
  tagType: 'closed',
  displayType: 'inline',
  props: [
    {
      name: 'value',
      type: 'number',
      example: 'x',
      description: 'The value to display.'
    },
    {
      name: 'step',
      type: 'string',
      example: '1',
      defaultValue: '1',
      description: 'The granularity of the changes.'
    },
    {
      name: 'min',
      type: 'number',
      example: '-100',
      defaultValue: 'none',
      description: 'The minimum value.'
    },
    {
      name: 'max',
      type: 'number',
      example: '100',
      defaultValue: 'none',
      description: 'The maximum value.'
    },
    {
      name: 'display',
      type: 'expression',
      defaultValue: 'none',
      description: 'A custom display transform to use'
    }
  ]
};

export default Dynamic;
