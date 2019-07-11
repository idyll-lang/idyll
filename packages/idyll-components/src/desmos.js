import React from 'react';

let desmosGraphCount = 0;

class Desmos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
        ? this.generateId(this.props.id)
        : `desmos-${desmosGraphCount++}`
    };
    this.elt;
    this.calculator;
  }

  render() {
    const {
      idyll,
      hasError,
      updateProps,
      apiKey,
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

  componentWillUpdate(nextProps) {
    const { equation } = nextProps;
    if (equation !== this.props.equation) {
      this.calculator.setExpression({ latex: equation });
    }
  }

  componentDidMount() {
    const { apiKey, equation } = this.props;
    const script = document.createElement('script');
    script.src = `https://www.desmos.com/api/v1.1/calculator.js?apiKey=${apiKey}`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      this.elt = document.getElementById(this.state.id);
      this.calculator = window.Desmos.GraphingCalculator(this.elt);
      if (equation) {
        this.calculator.setExpression({ latex: equation });
      } else {
        this.calculator.setBlank();
      }
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
