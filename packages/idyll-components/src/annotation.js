import React from 'react';
const { filterChildren } = require('idyll-component-children');

class Annotation extends React.PureComponent {
  render() {
    const { children } = this.props;
    const inline_text = children && children.length ? children.slice(-1) : [];
    const annotation_box =
      children && children.length ? children.slice(0, children.length - 1) : [];

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
  displayType: 'inline'
};

export default Annotation;
