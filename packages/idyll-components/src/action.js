import React from 'react';

class Action extends React.PureComponent {
  render() {
    const { idyll, hasError, updateProps, ...props } = this.props;

    return (
      <span {...props} className={'idyll-action'}>
        {this.props.children}
      </span>
    );
  }
}

Action._idyll = {
  name: 'Action',
  tagType: 'open',
  displayType: 'inline',
  children: ['action text'],
  props: [
    {
      name: 'onClick',
      type: 'event',
      example: '`x = !x`',
      description: 'An event that is triggered when a reader clicks.'
    },
    {
      name: 'onMouseEnter',
      type: 'event',
      example: '`x = true`',
      description:
        'An event that is triggered when a reader mouses over the element.'
    },
    {
      name: 'onMouseLeave',
      type: 'event',
      example: '`x = false`',
      description:
        'An event that is triggered when a reader removes their mouse from the element.'
    }
  ]
};

export default Action;
