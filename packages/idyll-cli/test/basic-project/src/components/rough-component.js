const React = require('react');

class RoughComponent extends React.Component {
  constructor(props) {
    super(props);
    this.svg = null;

    this.setSvgRef = element => {
      this.svg = element;
    }
  }

  componentDidMount() {
    const rc = rough.svg(this.svg);
    let nodes = [
      rc.circle(50, 50, 80, { fill: 'red' }), // fill with red hachure
      rc.rectangle(120, 15, 80, 80, { fill: 'red' }),
      rc.circle(50, 150, 80, {
        fill: "rgb(10,150,10)",
        fillWeight: 3 // thicker lines for hachure
      }),
      rc.rectangle(220, 15, 80, 80, {
        fill: 'red',
        hachureAngle: 60, // angle of hachure,
        hachureGap: 8
      }),
      rc.rectangle(120, 105, 80, 80, {
        fill: 'rgba(255,0,200,0.2)',
        fillStyle: 'solid' // solid fill
      })
    ];
    nodes.forEach(node => {
      this.svg.appendChild(node);
    })
  }

  render() {
    return (
      <svg width='400' height='400' ref={this.setSvgRef}>
      </svg>
    );
  }
}

module.exports = RoughComponent;
