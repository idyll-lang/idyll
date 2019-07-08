import React from 'react';

class Desmos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id ? this.generateId(this.props.id) : `desmos-graph`
    };
  }

  generateId(id = '') {
    return id
      .toString()
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  componentDidMount() {
    const { apiKey, equation } = this.props;
    const { id } = this.state;
    const script = document.createElement('script');
    script.src = `https://www.desmos.com/api/v1.1/calculator.js?apiKey=${apiKey}`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      var elt = document.getElementById(id);
      var calculator = window.Desmos.GraphingCalculator(elt);
      if (equation) {
        calculator.setExpression({ latex: equation });
      } else {
        calculator.setBlank();
      }
    };
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
