const React = require('react');
const IdyllComponent = require('idyll-component');

class Link extends IdyllComponent {
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

module.exports = Link;
