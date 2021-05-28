import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children, annotation, ...props } = this.props;
    return (
      <span className="annotated-text">
        {this.props.annotation}
        <div className="annotation-text">
          {filterChildren(children, c => {
            return c;
          })}
        </div>
      </span>
    );
  }
}

Annotation._idyll = {
  name: 'Annotation',
  tagType: 'open',
  displayType: 'inline',
  props: [
    {
      name: 'annotation',
      type: 'string',
      example: '"This is annotation text"',
      description: 'The displayed text when user hovers on annotated text.'
    }
  ]
};

export default Annotation;
