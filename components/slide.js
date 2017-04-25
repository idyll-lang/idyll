const React = require('react');
const IdyllComponent = require('idyll-component');

class Slide extends IdyllComponent {
  render() {
    return (
      <div className="slide" style={{position: 'absolute'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Slide;