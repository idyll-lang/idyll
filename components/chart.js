const React = require('react');
const IdyllComponent = require('idyll-component');
const V = require('victory');
const d3Arr = require('d3-array');

const types = {
  AREA: V.VictoryArea,
  TIME: V.VictoryLine,
  LINE: V.VictoryLine,
  BAR: V.VictoryBar,
  SCATTER: V.VictoryScatter,
  PIE: V.VictoryPie
};

class Chart extends IdyllComponent {
  render() {
    const type = this.props.type.toUpperCase();
    const INNER_CHART = types[type];
    let { scale, data, domain, ...customProps } = this.props;

    if (this.props.equation) {
      const d = domain;
      data = d3Arr.range(d[0], d[1], (d[1] - d[0]) / this.props.samplePoints).map((x) => {
        return {
          x: x,
          y: this.props.equation(x)
        };
      });
    }

    if (type === types.TIME) {
      scale = {x: 'time', y: 'linear'};
      data = data.map((d) => {
        return Object.assign({}, d, {
          x: new Date(d.x)
        });
      });
    }
    return (
      <div className={this.props.className}>
        {type !== 'PIE' ? (
          <V.VictoryChart domainPadding={10} scale={scale}>
            <INNER_CHART
              data={data}
              x={this.props.x}
              y={this.props.y}
              {...customProps}>
            </INNER_CHART>
          </V.VictoryChart>
        ) : (
          <INNER_CHART data={data} colorScale={this.props.colorScale}>
          </INNER_CHART>
        )
        }
      </div>
    );
  }
}

Chart.defaultProps = {
  domain: [-1, 1],
  range: [-1, 1],
  domainPadding: 0,
  samplePoints: 100,
  type: 'line'
};

module.exports = Chart;
