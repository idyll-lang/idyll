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

export default Slideshow;
