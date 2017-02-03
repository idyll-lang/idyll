const React = require('react');
const IdyllComponent = require('idyll-component');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Slideshow extends IdyllComponent {
  render() {
    return (
      <div className="slideshow" style={{position: 'relative'}}>
            <ReactCSSTransitionGroup
              transitionName="slideshow-slide"
              transitionEnterTimeout={800}
              transitionLeaveTimeout={300}>
                {this.props.children[this.props.currentSlide-1]}
            </ReactCSSTransitionGroup>
      </div>
    );
  }
}

Slideshow.defaultProps = {
  currentSlide: 1
};

module.exports = Slideshow;