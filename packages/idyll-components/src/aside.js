const React = require('react');

class Aside extends React.PureComponent {
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
