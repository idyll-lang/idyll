const React = require('react');

class Slide extends React.PureComponent {
  render() {
    return (
      <div className="slide" style={{position: 'absolute'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Slide;
