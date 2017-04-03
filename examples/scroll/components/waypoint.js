const React = require('react');
const IdyllComponent = require('idyll-component');

class Waypoint extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`waypoint ${this.props.className || ''}`} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Waypoint;
