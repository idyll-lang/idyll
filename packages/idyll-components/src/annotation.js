import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children } = this.props;

    const annotationBox = filterChildren(children || [], c => {
      return (
        (c._idyll &&
          c._idyll.name &&
          c._idyll.name.toLowerCase() === 'graphic') ||
        (c.type && c.type.name && c.type.name.toLowerCase() === 'graphic')
      );
    });

    const inlineText = filterChildren(children || [], c => {
      return (
        !(
          c._idyll &&
          c._idyll.name &&
          c._idyll.name.toLowerCase() === 'graphic'
        ) && !(c.type && c.type.name && c.type.name.toLowerCase() === 'graphic')
      );
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
