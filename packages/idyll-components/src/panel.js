
const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');

class Panel extends IdyllComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <div className="panel"  {...this.props} />;
  }

}

module.exports = Panel;