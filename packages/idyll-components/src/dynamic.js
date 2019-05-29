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
    const { format, value, map, min, step } = this.props;
    const mapOnArray = Array.isArray(map);
    const mapOnConditions = typeof map === 'string';
    if (mapOnArray) {
      const commonDiff = Math.ceil(Math.abs(step));
      const index = Math.floor((value - min) / commonDiff);
      return index < map.length ? map[index] : value;
    }
    if (mapOnConditions) {
      return map;
    }
    const formatter = Format.format(format);
    return formatter(value);
  }

  render() {
    const display = this.transformValue();
    return <span className="idyll-dynamic">{display}</span>;
  }
}

Dynamic.defaultProps = {
  format: '.2f',
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 1,
  interval: 0
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
      name: 'map',
      type: 'any',
      example: 'x',
      description: 'A custom value to be displayed instead of number.'
    }
  ]
};

export default Dynamic;
