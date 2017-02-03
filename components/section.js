const React = require('react');
const IdyllComponent = require('idyll-component');

class Section extends IdyllComponent {
  render() {
    return (
      <div className="section">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Section;