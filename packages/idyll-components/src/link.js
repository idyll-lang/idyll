import React from 'react';

class Link extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props;
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

export default Link;
