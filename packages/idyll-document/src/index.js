
import React from 'react';
import Runtime from './runtime';
import compile from 'idyll-compiler';

export const hashCode = (str) => {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {``
    chr   = str.charCodeAt(i);``
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
      hash: ''
    }
  }

  componentDidMount() {
    if (!this.props.ast && this.props.markup) {
      compile(this.props.markup)
        .then((ast) => {
          this.setState({ ast, hash: hashCode(this.props.markup) });
        })
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.ast) {
      return;
    }

    const hash = hashCode(newProps.markup);
    if (hash !== this.state.hash) {
      compile(newProps.markup)
        .then((ast) => {
          this.setState({ ast, hash });
        })
    }
  }

  render() {
    return (
      <Runtime
        {...this.props}
        key={ this.state.hash }
        ast={ this.props.ast || this.state.ast }
         />
    )
  }
}


export default IdyllDocument;
