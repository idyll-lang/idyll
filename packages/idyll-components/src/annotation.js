import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children } = this.props;

    const annotationBox = filterChildren(children || [], c => {
      let name = '';
      if (c && c.props && c.props.idyllASTNode && c.props.idyllASTNode.name) {
        name = c.props.idyllASTNode.name;
      } else if (c && c._idyll && c._idyll.name) {
        name = c._idyll.name;
      } else if (c && c.type && c.type.name) {
        name = c.type.name;
      } else {
        return false;
      }
      return name.toLowerCase() === 'graphic';
    });

    const inlineText = filterChildren(children || [], c => {
      let name = '';
      if (c && c.props && c.props.idyllASTNode && c.props.idyllASTNode.name) {
        name = c.props.idyllASTNode.name;
      } else if (c && c._idyll && c._idyll.name) {
        name = c._idyll.name;
      } else if (c && c.type && c.type.name) {
        name = c.type.name;
      } else {
        return true;
      }
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
