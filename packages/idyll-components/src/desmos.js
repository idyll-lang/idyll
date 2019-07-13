import React from 'react';

let desmosGraphCount = 0;
const desmosApiUrl = 'https://www.desmos.com/api/v1.1/calculator.js?apiKey=';
const desmosApiKey = 'dcb31709b452b1cf9dc26972add0fda6';

class Desmos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
        ? this.generateId(this.props.id)
        : `desmos-${desmosGraphCount++}`
    };
  }

  render() {
    const {
      idyll,
      hasError,
      updateProps,
      apiKey = desmosApiKey,
      equation,
      height = 400,
      width,
      id,
      ...attributeProps
    } = this.props;
    return (
      <div id={this.state.id} style={{ height, width }} {...attributeProps} />
    );
  }

  generateId(id = '') {
    return id
      .toString()
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  generateGraph(equation) {
    const { id } = this.state;
    document.getElementById(id).innerHTML = '';
    var elt = document.getElementById(id);
    var calculator = window.Desmos.GraphingCalculator(elt);
    if (equation) {
      calculator.setExpression({ latex: equation });
    } else {
      calculator.setBlank();
    }
  }

  componentWillUpdate(nextProps) {
    const { equation } = nextProps;
    if (equation !== this.props.equation) {
      this.generateGraph(equation);
    }
  }

  componentDidMount() {
    const { apiKey, equation } = this.props;
    const script = document.createElement('script');
    script.src = `${desmosApiUrl + apiKey}`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      this.generateGraph(equation);
    };
  }
}

Desmos._idyll = {
  name: 'Desmos',
  tagType: 'closed',
  props: [
    {
      name: 'apiKey',
      type: 'string',
      example: '"dcb31709b452b1cf9dc26972add0fda6"'
    },
    {
      name: 'equation',
      type: 'string',
      example: '"y=x^2"'
    },
    {
      name: 'id',
      type: 'string',
      example: '"linear-equation"'
    },
    {
      name: 'height',
      type: 'string',
      example: '"400px"'
    },
    {
      name: 'width',
      type: 'string',
      example: '"350px"'
    }
  ]
};

export default Desmos;
