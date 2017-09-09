const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Screen = require('./utils/screen');

class Waypoint extends IdyllComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen direction="row"  {...this.props} />;
  }

}
