const React = require('react');

class Fixed extends React.PureComponent {
  render() {
    return (
      <div style={{position: 'fixed'}} className="fixed">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Fixed;
