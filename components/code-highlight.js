const React = require('react');
const IdyllComponent = require('idyll-component');
import SyntaxHighlighter from "react-syntax-highlighter/dist/light";
import style from 'react-syntax-highlighter/dist/styles/github';

class CodeHighlight extends IdyllComponent {
  render() {
    return <SyntaxHighlighter style={style} language={this.props.language}>{this.props.children[0]}</SyntaxHighlighter>;
  }
}

module.exports = CodeHighlight;
