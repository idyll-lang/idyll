import React from 'react';
const Slide = require('./slide');

class Slideshow extends React.PureComponent {

  getChildren(children) {
    let processedChildren = [];
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        return;
      }
      if ((child.type.name && child.type.name.toLowerCase() === 'slide') || child.type.prototype instanceof Slide) {
        processedChildren.push(child);
      } else {
        processedChildren = processedChildren.concat(this.getChildren(child.props.children));
      }
    })
    return processedChildren;
  }

  render() {
    return (
      <div className="slideshow" style={{position: 'relative'}}>
          {this.getChildren(this.props.children)[this.props.currentSlide-1]}
      </div>
    );
  }
}

Slideshow.defaultProps = {
  currentSlide: 1
};

Slideshow._idyll = {
  name: "Slideshow",
  tagType: "open",
  children: [`
[slide]This is the content for slide 1[/slide]
[slide]This is the content for slide 2[/slide]
[slide]This is the content for slide 3[/slide]`],
  props: [{
    name: "currentSlide",
    type: "number",
    example: 'x'
  }]
}
export default Slideshow;
