const React = require('react');
const IdyllComponent = require('idyll-component');
import SyntaxHighlighter from "react-syntax-highlighter/dist/light";
import style from 'react-syntax-highlighter/dist/styles/github';

const languageMap = {
  js: 'javascript',
  html: 'htmlbars'
};

const getLanguage = (l) => {
  if (languageMap[l]) {
    return languageMap[l];
  }
  return l;
}

class CodeHighlight extends IdyllComponent {

  render() {
    return <SyntaxHighlighter style={style} language={getLanguage(this.props.language)}>{this.props.children[0]}</SyntaxHighlighter>;
  }
}

module.exports = CodeHighlight;
