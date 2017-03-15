const React = require('react');
const IdyllComponent = require('idyll-component');
const V = require('victory');

const types = {
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
    let scale = this.props.scale;
    let data = this.props.data;
    if (type === 'TIME') {
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
            <INNER_CHART data={data} x={this.props.x} y={this.props.y}>
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

module.exports = Chart;
