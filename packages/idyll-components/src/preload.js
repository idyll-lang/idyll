import React from 'react';
const ReactDOM = require('react-dom');
const imageCache = [];

class Preloader extends React.PureComponent {
  componentDidMount() {
    const { images } = this.props;
    images.forEach(i => {
      const img = new Image();
      img.src = i;
      imageCache.push(img);
    });
  }
  render() {
    return null;
  }
}

Preloader.defaultProps = {
  images: []
};

Preloader._idyll = {
  name: 'Preloader',
  tagType: 'closed',
  displayType: 'inline',
  props: [
    {
      name: 'images',
      type: 'array',
      description:
        'the array of images: `["image-url-1.png", "image-url-2.jpg"]`.',
      example: '["image-url-1.png", "image-url-2.jpg"]'
    }
  ]
};

export default Preloader;
