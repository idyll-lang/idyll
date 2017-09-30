import React from 'react';
import * as components from 'idyll-components';
import IdyllDocument from 'idyll-document';

class Renderer extends React.PureComponent {
  render() {
    const { idyllMarkup, ast, idyllHash } = this.props;
    return (
      <div className={"renderer"}>
        <div className={"renderer-container"}>
          <IdyllDocument
            ast={ast}
            components={components}
            key={idyllHash}
            datasets={{}}
          />
        </div>
      </div>
    );
  }
}

export default Renderer;
