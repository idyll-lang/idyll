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
  }

  render() {
    const { id, props } = this;
    const type = props.type.toUpperCase();
    const INNER_CHART = types[type];
    let { scale, data, domain, animate, ...customProps } = props;

    if (props.equation) {
      const d = domain;
      data = d3Arr.range(d[0], d[1], (d[1] - d[0]) / props.samplePoints).map((x) => {
        try {
          return {
            x: x,
            y: props.equation(x)
          };
        } catch(err) {
          return {
            x: x,
            y: 0
          }
        }
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
          <V.VictoryChart domainPadding={10} animate={animate} scale={scale} containerId={`container-${id}`} clipId={`clip-${id}`} >
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


Chart._idyll = {
  name: "Chart",
  tagType: "closed",
  props: [{
    name: "type",
    type: "string",
    example: '"scatter"'
  },{
    name: "data",
    type: "array",
    example: "`[{x: 1, y: 1}, { x: 2, y: 2 }]`"
  }]
}

export default Chart;
