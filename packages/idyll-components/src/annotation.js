import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const inline_text = this.props.children.slice(-1);
    const annotation_box = this.props.children.slice(0, children.length - 1);

    return (
      <span className="annotated-text">
        {filterChildren(inline_text, c => {
          return c;
        })}
        <div className="annotation-text">
          {filterChildren(annotation_box, c => {
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
