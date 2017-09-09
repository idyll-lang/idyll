const React = require('react');
const ReactDOM = require('react-dom');
const imageCache = [];

class Preloader extends React.Component {
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

module.exports = Preloader;