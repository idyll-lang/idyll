import React from 'react';

class Float extends React.PureComponent {
  render() {
    return (
      <div
        className={`float ${this.props.position}`}
        style={{
          float: this.props.position,
          width: this.props.width || '50%',
          ...this.props.style
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

Float._idyll = {
  name: 'Float',
  tagType: 'open',
  children: [
    `Content placed here will take up half of the text-column width. Use the properties to specify left or right.`
  ],
  props: [
    {
      name: 'position',
      type: 'string',
      example: '"left"',
      description: 'the float position: left or right.'
    },
    {
      name: 'width',
      type: 'string',
      example: '"50%"',
      defaultValue: '"50%"',
      description:
        'the width of the component, specified in pixels or percentage.'
    }
  ]
};

export default Float;
