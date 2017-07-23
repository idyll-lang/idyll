const components = require('idyll-default-components');
const IdyllDocument = require('idyll-interactive-document');
const React = require('react');

class Renderer extends React.PureComponent {
  render() {
    const { idyllMarkup, ast, idyllHash } = this.props;
    return (
      <div className={"renderer"}>
        <div className={"renderer-container"}>
          <IdyllDocument
            ast={ast}
            componentClasses={components}
            key={idyllHash}
            datasets={{}}
          />
        </div>
      </div>
    );
  }
}

module.exports = Renderer;