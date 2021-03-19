import React from 'react';

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
    const { value, className, style } = this.props;
    return (
      <input
        type="checkbox"
        onChange={this.toggleCheckbox.bind(this)}
        onClick={this.props.onClick || (e => e.stopPropagation())}
        checked={value}
        className={`idyll-checkbox ${className ? className : ''}`.trim()}
        style={style}
      />
    );
  }
}

Boolean.defaultProps = {
  value: false
};

Boolean._idyll = {
  name: 'Boolean',
  tagType: 'closed',
  props: [
    {
      name: 'value',
      type: 'boolean',
      example: 'x',
      description:
        'A value for the checkbox. If this value is truthy, the checkbox will be shown.'
    }
  ]
};

export default Boolean;
