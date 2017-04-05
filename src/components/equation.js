const React = require('react');
const IdyllComponent = require('idyll-component');
const Latex = require('react-latex');

document.write('<link href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css" rel="stylesheet">');

class Equation extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const latexChar = '$';
    const latexString = latexChar + (this.props.children[0] ? this.props.children[0] : '') + latexChar;
    return (
      <span>
          <Latex>{latexString}</Latex>
      </span>
    );
  }
}

module.exports = Equation;
