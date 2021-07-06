import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children } = this.props;

    const annotationBox = filterChildren(children || [], c => {
      let name = '';
      name = name || (c._idyll ? c._idyll.name : name);
      name = name || (c.type ? c.type.name : name);
      name =
        name ||
        (c.props && c.props.idyllASTNode ? c.props.idyllASTNode.name : name);
      return name.toLowerCase() === 'graphic';
    });

    const inlineText = filterChildren(children || [], c => {
      let name = '';
      name = name || (c._idyll ? c._idyll.name : name);
      name = name || (c.type ? c.type.name : name);
      name =
        name ||
        (c.props && c.props.idyllASTNode ? c.props.idyllASTNode.name : name);
      return name.toLowerCase() !== 'graphic';
    });

    return (
      <div style={{ display: 'inline' }}>
        {' '}
        <div className="annotated-text">
          {inlineText} <div className="annotation-text">{annotationBox}</div>
        </div>{' '}
      </div>
    );
  }
}

Annotation._idyll = {
  name: 'Annotation',
  tagType: 'open',
  displayType: 'inline'
};

export default Annotation;
