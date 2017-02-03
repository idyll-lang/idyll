const React = require('react');
const IDLComponent = require('../idl-component');

class Section extends IDLComponent {
  render() {
    return (
      <div className="section">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Section;