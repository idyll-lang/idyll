import React from 'react';

class Annotation extends React.PureComponent {
  render() {
    return (
      <span className="annotated-text">
        {this.props.children}
        <span className="annotation-text">{this.props.annotation}</span>
      </span>
    );
  }
}

Annotation._idyll = {
  name: 'Annotation',
  tagType: 'open',
  displayType: 'inline',
  children: [
    'Content placed inside of an annotation component will be displayed inline with some styling.'
  ],
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
