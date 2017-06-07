const React = require('react');
const IdyllComponent = require('idyll-component');

class Slideshow extends IdyllComponent {

  getChildren(children) {
    let processedChildren = [];
    React.Children.forEach(children, (child) => {
      if (typeof child === 'string') {
        return;
      }
      if (child.type.name && child.type.name.toLowerCase() === 'slide') {
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

module.exports = Slideshow;
