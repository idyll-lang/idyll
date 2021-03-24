import React from 'react';

class Annotation extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { idyll, hasError, updateProps, ...props } = this.props;
    return (
      <div className="annotated-text">
        {props.children}
        <span className="annotation-text">{props.annotation}</span>
      </div>
    );
  }
}

Annotation._idyll = {
  name: 'Annotation',
  tagType: 'closed',
  displayType: 'inline',
  props: [
    {
      name: 'text',
      type: 'string',
      example: '"This is annotated text"',
      description: 'The text to display'
    },
    {
      name: 'annotation',
      type: 'string',
      example: '"This is annotation text"',
      description: 'The displayed text when user hovers on annotated text.'
    }
  ]
};

export default Annotation;
