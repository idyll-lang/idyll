import React from 'react';

class Action extends React.PureComponent {
  render() {
    const { idyll, hasError, updateProps, ...props } = this.props;

    return (
      <span
        {...props}
        onClick={
          this.props.onClick ? this.props.onClick : e => e.stopPropagation()
        }
        className={'idyll-action'}
      >
        {this.props.children}
      </span>
    );
  }
}

Action._idyll = {
  name: 'Action',
  tagType: 'open',
  displayType: 'inline',
  children: ['Click me to trigger an action'],
  props: [
    {
      name: 'onClick',
      type: 'event',
      example: '`alert("You clicked the text.")`',
      description: 'An event that is triggered when a reader clicks.'
    },
    {
      name: 'onMouseEnter',
      type: 'event',
      description:
        'An event that is triggered when a reader mouses over the element, e.g. `x = true`.'
    },
    {
      name: 'onMouseLeave',
      type: 'event',
      description:
        'An event that is triggered when a reader removes their mouse from the element, e.g. `x = false`.'
    }
  ]
};

export default Action;
