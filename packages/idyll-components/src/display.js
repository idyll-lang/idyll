import React from 'react';
const Format = require('d3-format');

class Display extends React.PureComponent {
  constructor(props) {
    super(props);
    this.format = Format.format(props.format || '0.2f');
  }

  formatValue(v) {
    const t = typeof v;
    switch (t) {
      case 'object':
        return JSON.stringify(v);
      case 'boolean':
        return '' + v;
      case 'number':
        return this.format(v);
      case 'string':
      default:
        return v;
    }
  }

  render() {
    const { value, style } = this.props;
    const v = value !== undefined ? value : this.props.var;
    return (
      <span
        style={style}
        className={`idyll-display ${
          this.props.className ? this.props.className : ''
        }`.trim()}
      >
        {this.formatValue(v)}
      </span>
    );
  }
}

Display._idyll = {
  name: 'Display',
  tagType: 'closed',
  displayType: 'inline',
  props: [
    {
      name: 'value',
      type: 'any',
      example: 'x',
      description: 'The value to be displayed.'
    },
    {
      name: 'format',
      type: 'string',
      example: '"0.2f"',
      description:
        'The format to use, powered by [d3-format](https://github.com/d3/d3-format).'
    }
  ]
};

export default Display;
