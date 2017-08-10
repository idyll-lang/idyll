const React = require('react');
const Editor = require('./editor');
const Renderer = require('./renderer');
const fs = require('fs');
const initialValue = fs.readFileSync(__dirname + '/initial.idl', 'utf8');
const compile = require('idyll-compiler');
const hashCode = require('./utils').hashCode;

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idyllMarkup: initialValue,
      idyllHash: '',
      error: null,
      ast: compile(initialValue)
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const hash = hashCode(value.trim());
    if (hash === this.state.hashCode) {
      return;
    }
    try {
      const ast = compile(value);
      this.setState({
        idyllHash: hash,
        idyllMarkup: value,
        ast: ast,
        error: null
      })
    } catch(e) {
      this.setState({
        error: e.message
      })
    }
  }

  render() {
    const { idyllMarkup, ast, error, idyllHash } = this.state;
    return (
      <div className={"container"}>
        <Editor initialValue={idyllMarkup} onChange={this.handleChange} />
        <Renderer ast={ast} idyllMarkup={idyllMarkup} idyllHash={idyllHash} />
        {
          error && (
            <div className={'error-display'}>
              <pre>
                 {error}
              </pre>
            </div>
          )
        }
      </div>
    )
  }
}

module.exports = App;
