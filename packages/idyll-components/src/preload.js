import React from 'react';
const ReactDOM = require('react-dom');
const imageCache = [];

class Preloader extends React.PureComponent {
  componentDidMount() {
    const { images } = this.props;
    images.forEach((i) => {
      const img = new Image();
      img.src = i;
      imageCache.push(img);
    });
  }
  render () {
    return null;
  }
}

Preloader.defaultProps = {
  images: []
};

export default Preloader;
