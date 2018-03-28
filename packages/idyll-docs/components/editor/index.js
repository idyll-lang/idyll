import React from 'react'
import IdyllEditArea from './edit-area'
import IdyllRenderer from './renderer'
import compile from 'idyll-compiler'
import GlobalStyles from '../global-styles'
import { hashCode } from './utils'
import styles from './styles'

class LiveIdyllEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    const { markup } = props
    this.state = {
      ...this.stateObjectForMarkup(markup),
      initialMarkup: markup,
    }
  }

  stateObjectForMarkup = (idyllMarkup, hash = null) => ({
    idyllHash: hash || hashCode(idyllMarkup),
    error: null,
    ast: compile(idyllMarkup),
  })

  setContent(value) {
    // console.log('setting content ', value);
    try {
      const hash = hashCode(value)
      if (hash !== this.state.idyllHash) {
        this.setState(this.stateObjectForMarkup(value, hash))
      }
    } catch (e) {
      this.setState({ error: e.message })
    }
  }

  componentDidCatch(error, info) {
    // console.log(error);
    this.setState({ error: error.message });
  }

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  handleChange = (newContent) => {
    this.setContent(newContent)
    const { onChange } = this.props
    if (onChange) {
      onChange(newContent)
    }
  }

  render() {
    const { fullscreen } = this.props;
    const { initialMarkup, ast, error, idyllHash } = this.state
    return (
      <div className='container'>
        {
          fullscreen ? null : <IdyllEditArea initialContent={ initialMarkup } onChange={ this.handleChange } />
        }
        <IdyllRenderer ast={ ast } idyllHash={ idyllHash } />
        { error && this.renderError() }
        <style jsx global>{styles}</style>
        <style jsx>{`
          .container {
            flex: 1;
            display: flex;
            flex-direction: row;
            overflow: auto;
          }
        `}</style>
        <GlobalStyles />
      </div>
    )
  }

  renderError = () => (
    <div className='error-display'>
      <pre>
        {this.state.error}
      </pre>
      <style jsx>{`
        .error-display {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-family: Courier New, Courier, monospace;
          font-size: 12px;
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 5px 10px;
        }
      `}</style>
    </div>
  )
}

export default LiveIdyllEditor
