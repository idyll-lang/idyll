const React = require('react');
const Editor = require('./editor');
const Renderer = require('./renderer');

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idyllMarkup: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    console.log('handle change');
    this.setState({
      idyllMarkup: value
    })
  }

  render() {
    const { idyllMarkup } = this.state;
    return (
      <div className={"container"}>
        <Editor value={idyllMarkup} onChange={this.handleChange} />
        <Renderer idyllMarkup={idyllMarkup} />
      </div>
    )
  }
}

module.exports = App;
