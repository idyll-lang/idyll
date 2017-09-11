const React = require('react');
const ReactDOM = require('react-dom');
const Screen = require('./utils/screen');

class Waypoint extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen direction="row"  {...this.props} />;
  }

}
