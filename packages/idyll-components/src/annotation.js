import React from 'react';
import Image from './image.js';

class Annotation extends React.PureComponent {
  render() {
    const hasGraphic = this.props.src;
    return (
      <span className="annotated-text">
        {this.props.children}
        <div className="annotation-text">
          <Image src={hasGraphic} />
          {this.props.annotation}
        </div>
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
      src: 'src',
      example: '"This is annotation text"',
      description: 'The displayed text when user hovers on annotated text.'
    }
  ]
};

export default Annotation;
