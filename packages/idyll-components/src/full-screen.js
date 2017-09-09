
const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Screen = require('./screen');

class FullScreen extends IdyllComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen fullBleed={true} align="stretch"  {...this.props} />;
  }

}

module.exports = FullScreen;