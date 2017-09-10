const React = require('react');
import SyntaxHighlighter from "react-syntax-highlighter/dist/light";
import style from 'react-syntax-highlighter/dist/styles/github';

class CodeHighlight extends React.PureComponent {
  render() {
    return <SyntaxHighlighter style={style} language={this.props.language}>{this.props.children[0]}</SyntaxHighlighter>;
  }
}

module.exports = CodeHighlight;
