const React = require('react');

class Waypoint extends React.PureComponent {
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
