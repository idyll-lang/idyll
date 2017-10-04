import React from 'react';
import SyntaxHighlighter from "react-syntax-highlighter/dist/light";
import style from 'react-syntax-highlighter/dist/styles/github';

class CodeHighlight extends React.PureComponent {
  render() {
    return <SyntaxHighlighter style={style} language={this.props.language}>{this.props.children.length ? this.props.children[0] : ''}</SyntaxHighlighter>;
  }
}

CodeHighlight.defaultProps = {
  children: []
}

export default CodeHighlight;
