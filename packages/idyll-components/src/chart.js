import React from 'react';
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

let chartCount = 0;

class Chart extends React.PureComponent {

  constructor(props) {
    super(props);
    this.id = chartCount++;
    this.state = {};
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error: error });
  }

  render() {
    const { id, props } = this;
    const type = props.type.toUpperCase();

    if (this.state.hasError) {
      return (
        <div style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            padding: '1em',
            backgroundColor: 'pink',
            border: '8px solid darkred'
          }}
        >
          <p>{this.state.error.message}</p>
          I'm a <a href="https://github.com/idyll-lang/idyll/blob/master/packages/idyll-components/src/chart.js">Chart component!</a>
          <br/>
          Valid types are:
          <ul>
            <li>area</li>
            <li>time</li>
            <li>line</li>
            <li>bar</li>
            <li>scatter</li>
            <li>pie</li>
          </ul>
        </div>
      );
    }

    if (props.help) {
      return (
        <div style={{
            padding: '2em',
            backgroundColor: 'lightblue',
            border: '4px solid blue'
          }}
        >
          This comp uses Victory charts.

          Example syntax: `[Chart type:"line" /]`
        </div>
      )
    }

    const INNER_CHART = types[type];
    let { scale, data, domain, ...customProps } = props;

    if (props.equation) {
      const d = domain;
      data = d3Arr.range(d[0], d[1], (d[1] - d[0]) / props.samplePoints).map((x) => {
        return {
          x: x,
          y: props.equation(x)
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
      <div className={props.className}>
        {type !== 'PIE' ? (
          <V.VictoryChart domainPadding={10} scale={scale} containerId={`container-${id}`} clipId={`clip-${id}`} >
            <INNER_CHART
              data={data}
              x={props.x}
              y={props.y}
              {...customProps}>
            </INNER_CHART>
          </V.VictoryChart>
        ) : (
          <INNER_CHART data={data} colorScale={props.colorScale}>
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

export default Chart;
