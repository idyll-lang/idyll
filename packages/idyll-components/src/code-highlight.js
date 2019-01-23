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

CodeHighlight._idyll = {
  name: "CodeHighlight",
  tagType: "open",
  children: ['var x = 1;'],
  props: [{
    name: "language",
    type: "string",
    example: "javascript"
  }]
}
export default CodeHighlight;
