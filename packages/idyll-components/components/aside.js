const React = require('react');
const IdyllComponent = require('idyll-component');

class Aside extends IdyllComponent {
  render() {
    return (
      <div className={'aside-container'}>
        <div className={'aside'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = Aside;
