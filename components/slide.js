const React = require('react');
const IDLComponent = require('../idl-component');

class Slide extends IDLComponent {
  render() {
    return (
      <div className="slide" style={{position: 'absolute'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Slide;