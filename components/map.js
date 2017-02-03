const MapGL = require('react-map-gl');
const React = require('react');
const IdyllComponent = require('idyll-component');

class Map extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    this.updateProps({
      value: +event.target.value
    });
  }

  render() {
    const { width, height, latitude, longitude, zoom } = this.props;
    return (
      <MapGL
        width={width}
        height={height}
        latitude={+latitude}
        longitude={+longitude}
        zoom={zoom}
        mapboxApiAccessToken='pk.eyJ1IjoibWF0aGlzb25pYW4iLCJhIjoiY2l5bTA5aWlnMDAwMDN1cGZ6Y3d4dGl6MSJ9.JZaRAfZOZfAnU2EAuybfsg'
      />
    );
  }
}

Map.defaultProps = {
  width: 400,
  height: 400,
  latitude: 47.6062,
  longitude: -122.3321,
  zoom: 10
};

module.exports = Map;