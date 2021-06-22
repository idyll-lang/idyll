import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children } = this.props;

    const annotationBox = filterChildren(children || [], c => {
      return c.type && c.type.name && c.type.name.toLowerCase() === 'graphic';
    });

    const inlineText = filterChildren(children || [], c => {
      return !c.type || !c.type.name || c.type.name.toLowerCase() !== 'graphic';
    });

    return (
      <span>
        {' '}
        <span className="annotated-text">
          {inlineText} <span className="annotation-text">{annotationBox}</span>
        </span>{' '}
      </span>
    );
  }
}

Annotation._idyll = {
  name: 'Annotation',
  tagType: 'open',
  displayType: 'inline'
};

export default Annotation;
