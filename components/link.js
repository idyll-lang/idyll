const React = require('react');
const IdyllComponent = require('idyll-component');

class Link extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a {...this.props}>
        {this.props.text}
      </a>
    );
  }
}

module.exports = Link;
