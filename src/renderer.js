const components = require('idyll-default-components');
const IdyllDocument = require('idyll-interactive-document');
const React = require('react');
const compile = require('idyll-compiler');
const hashCode = require('./utils').hashCode;

class Renderer extends React.PureComponent {
  render() {
    const { idyllMarkup } = this.props;
    return (
      <div className={"renderer"}>
        <IdyllDocument
          ast={compile(idyllMarkup, { spellcheck: false })}
          componentClasses={components}
          key={hashCode(idyllMarkup.trim())}
          datasets={{}}
        />
      </div>
    );
  }
}

module.exports = Renderer;