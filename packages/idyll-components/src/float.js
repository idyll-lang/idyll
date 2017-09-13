const React = require('react');

class Float extends React.PureComponent {
  render() {
    return (
      <div className={`float ${this.props.position}`} style={{float: this.props.position, width: this.props.width || '50%'}}>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Float;
