const React = require('react');
const IdyllComponent = require('idyll-component');
const V = require('victory');

const types = {
  LINE: V.VictoryLine,
  BAR: V.VictoryBar,
  SCATTER: V.VictoryScatter
};

class Chart extends IdyllComponent {
  render() {
    const scale = 1 / (( this.props.randomSeed % 3  +  1));
    const INNER_CHART = types[this.props.type.toUpperCase()];
    const data = Array(100).fill().map((_) => {
      return {
        x: scale * Math.random(),
        y: scale * Math.random()
      }
    });

    return (
      <div className={this.props.className}>
        <V.VictoryChart domainPadding={10} animate={{ duration: 750, easing: "quadInOut" }}>
          <INNER_CHART data={data} domain={[0, 1]} >
          </INNER_CHART>
        </V.VictoryChart>
      </div>
    );
  }
}

module.exports = Chart;
