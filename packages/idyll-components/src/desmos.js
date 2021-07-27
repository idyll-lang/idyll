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
    if (
      (!this.props.apiKey || this.props.apiKey === desmosApiKey) &&
      typeof window === 'undefined'
    ) {
      console.warn(
        `\nWarning! You are using default API key for desmos. If you plan to use Desmos in production you should obtain a key from https://www.desmos.com/api/v1.3/docs/index.html#document-api-keys and supply it as the apiKey parameter.\n`
      );
    }
    this.getCurrentLatex = this.getCurrentLatex.bind(this);
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
      style,
      ...attributeProps
    } = this.props;
    return (
      <div
        id={this.state.id}
        style={{ ...style, height, width }}
        {...attributeProps}
      />
    );
  }

  generateId(id = '') {
    return id
      .toString()
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  getCurrentLatex() {
    if (!this.calculator) {
      return;
    }
    const { expressions } = this.calculator.getState();
    const filteredExpressions = expressions.list.filter(
      d => d.type === 'expression'
    );
    if (filteredExpressions.length) {
      return filteredExpressions[0].latex;
    }
  }

  generateGraph(equation) {
    const { id } = this.state;
    document.getElementById(id).innerHTML = '';
    const elt = document.getElementById(id);
    const calculator = window.Desmos.GraphingCalculator(elt);
    if (equation) {
      calculator.setExpression({ latex: equation });
    } else {
      calculator.setBlank();
    }

    this.calculator = calculator;

    // Have to pull these functions out because
    // `observeEvent` won't work with an arrow
    // function.
    const { updateProps } = this.props;
    const { getCurrentLatex } = this;

    // Catch changes when a user edits the
    // calculator.
    calculator.observeEvent('change', function() {
      const latex = getCurrentLatex();
      if (latex) {
        updateProps({ equation: latex });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { equation } = this.props;
    // Only instantiate & update the calculator
    // when necessary to improve performance.
    if (
      equation !== prevProps.equation &&
      equation !== this.getCurrentLatex()
    ) {
      if (this.calculator) {
        const newState = this.calculator.getState();
        newState.expressions.list[0].type = 'expression';
        newState.expressions.list[0].latex = equation;
        this.calculator.setState(newState);
      } else {
        this.generateGraph(equation);
      }
    }
  }

  componentDidMount() {
    const { apiKey = desmosApiKey, equation } = this.props;
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
      example: '"100%"'
    }
  ]
};

export default Desmos;
