const React = require('react');
const IdyllComponent = require('idyll-component');

class Aside extends IdyllComponent {
  render() {
    return (
      <div className={'relative'}>
        <div className={'aside'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = Aside;
