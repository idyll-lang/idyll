
import React from 'react';
import Runtime from './runtime';
import compile from 'idyll-compiler';

export const hashCode = (str) => {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

class IdyllDocument extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ast: props.ast || [],
      previousAST: props.ast || [],
      hash: '',
      error: null
    }
  }

  componentDidMount() {
    if (!this.props.ast && this.props.markup) {
      compile(this.props.markup, this.props.compilerOptions)
        .then((ast) => {
          this.setState({ ast, hash: hashCode(this.props.markup) });
        })
    }
  }

  componentDidCatch(error, info) {
    this.props.onError && this.props.onError(error);
    this.setState({ error: error.message });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.ast) {
      return;
    }

    const hash = hashCode(newProps.markup);
    if (hash !== this.state.hash) {
      this.setState({ previousAST: this.state.ast });
      compile(newProps.markup, newProps.compilerOptions)
        .then((ast) => {
          this.setState({ previousAST: ast, ast, hash });
        })
        .catch(this.componentDidCatch.bind(this));
    }
  }


  render() {
    return (
      <div style={{position: 'relative'}}>
        {
          this.error ? (
            <div className="idyll-document-error" style={{position: 'absolute', left: 0, right: 0, top: 0}}>
              {
                this.error
              }
            </div>
          ) : null
        }
        <Runtime
          {...this.props}
          key={ this.state.hash }
          context={(context) => { this.idyllContext = context; this.props.context && this.props.context(context); }}
          initialState={this.props.initialState || (this.idyllContext ? this.idyllContext.data() : {})}
          ast={ this.props.ast || this.state.ast }
          />
      </div>
    )
  }
}


export default IdyllDocument;
