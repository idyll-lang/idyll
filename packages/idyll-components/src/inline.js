const React = require('react');

class Inline extends React.PureComponent {
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Inline;
