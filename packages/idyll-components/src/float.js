import React from 'react';

class Float extends React.PureComponent {
  render() {
    return (
      <div className={`float ${this.props.position}`} style={{float: this.props.position, width: this.props.width || '50%'}}>
        {this.props.children}
      </div>
    );
  }
}


Float._idyll = {
  name: "Float",
  tagType: "open",
  props: [{
    name: "position",
    type: "string",
    example: '"left"'
  }, {
    name: 'width',
    type: 'string',
    example: '"50%"'
  }]
}

export default Float;
