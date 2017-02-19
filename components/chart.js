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
    const INNER_CHART = types[this.props.type.toUpperCase()];
    return (
      <div className={this.props.className}>
        <V.VictoryChart domainPadding={10}>
          <INNER_CHART data={this.props.data}>
          </INNER_CHART>
        </V.VictoryChart>
      </div>
    );
  }
}

module.exports = Chart;
