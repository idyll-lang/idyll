import React from 'react';

class Link extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let props = {...this.props};
    if (props.url) {
      props.href = props.url;
    }
    return (
      <a {...props}>
        {this.props.text || this.props.children}
      </a>
    );
  }
}

Link._idyll = {
  name: "Link",
  tagType: "closed",
  props: [{
    name: "text",
    type: "string",
    example: '"Link Text"'
  }, {
    name: 'url',
    type: 'string',
    example: '"https://some.url/"'
  }]
}

export default Link;
