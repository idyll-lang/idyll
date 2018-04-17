import React from 'react';

class Action extends React.PureComponent {
  render() {
    return (
      <span {...this.props} className={'idyll-action'}>{this.props.children}</span>
    );
  }
}

Action._idyll = {
  name: "Action",
  tagType: "open",
  children: [
    "action text"
  ],
  props: [{
    name: "onClick",
    type: 'event',
    example: '`x = !x`'
  }, {
    name: "onMouseEnter",
    type: 'event',
    example: '`x = true`'
  }, {
    name: "onMouseLeave",
    type: 'event',
    example: '`x = false`'
  }]
}

export default Action;
