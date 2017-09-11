
const React = require('react');
const ReactDOM = require('react-dom');
const Screen = require('./utils/screen');

class FullScreen extends React.PureComponent {
  constructor (props) {
    super(props);
  }

  render() {
    return <Screen fullBleed={true} align="stretch"  {...this.props} />;
  }

}

module.exports = FullScreen;