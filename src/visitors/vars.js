const ReactDOM = require('react-dom');
const { COMPONENTS, DATASET, PROPERTIES, DERIVED, VARIABLE } = require('../constants');

module.exports = function(component, datasets) {
  let nodeID = -1;
  const walkVars = function (node) {
    nodeID++;
    if (typeof node === 'string') {
      return;
    }

    const componentName = node[0];
    const props = node[1];
    const children = node[2];
    if (componentName === COMPONENTS.Dataset) {
      let varName, varVal;
      props.forEach((propArr) => {
        const propName = propArr[0];
        const propValueArr = propArr[1];
        switch (propName) {
          case DATASET.Name:
            varName = propValueArr[1];
            varVal = datasets[varName];
            break;
        }
      });
      this.initialState[varName] = varVal;
    } else if (componentName === COMPONENTS.Variable) {
      let varName, varVal;
      props.forEach((propArr) => {
        const propName = propArr[0];
        const propValueArr = propArr[1];
        switch (propName) {
          case VARIABLE.Name:
            varName = propValueArr[1];
            break;
          case VARIABLE.Value:
            switch (propValueArr[0]) {
              case PROPERTIES.Value:
                varVal = propValueArr[1];
                break;
              case PROPERTIES.Variable:
                varVal = this.initialState[propValueArr[1]];
                break;
              case PROPERTIES.Expression:
                let evalFunc = '(() => {';
                const expression = propValueArr[1];
                Object.keys(this.initialState).forEach((propName) => {
                  if (expression.indexOf(propName) === -1) {
                    return;
                  }
                  const val = this.initialState[propName];
                  evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
                });
                evalFunc += 'return ' + propValueArr[1] + ';';
                evalFunc += '})()';
                varVal = eval(evalFunc);
                break;
            }
        }
      });
      this.initialState[varName] = varVal;
    } else if (componentName === COMPONENTS.Derived) {
      let varName, getFunc;
      props.forEach((propArr) => {
        const propName = propArr[0];
        const propValueArr = propArr[1];
        switch (propName) {
          case DERIVED.Name:
            varName = propValueArr[1];
            break;
          case DERIVED.Value:
            switch (propValueArr[0]) {
              case PROPERTIES.Value:
              case PROPERTIES.Variable:
                console.warn('Derived value should be an expression');
                break;
              case PROPERTIES.Expression:
                getFunc = (state) => {
                  let evalFunc = '(() => {';
                  const expression = propValueArr[1];
                  Object.keys(state).forEach((propName) => {
                    if (expression.indexOf(propName) === -1) {
                      return;
                    }
                    const val = state[propName];
                    evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
                  });
                  evalFunc += 'return ' + propValueArr[1] + ';';
                  evalFunc += '})()';
                  return evalFunc;
                }
                break;
            }
        }
      });
      this.derivedVars[varName] = {
        value: eval(getFunc(Object.assign({}, this.initialState, this.getDerivedVars()))),
        update: (newState) => {
          this.derivedVars[varName].value = eval(getFunc(Object.assign({}, this.state, newState, this.getDerivedVars())));
        }
      };
    } else {
      props.forEach((propArr, i) => {
        const propName = propArr[0];
        const propValueArr = propArr[1];
        if (propValueArr[0] === PROPERTIES.Variable) {
          if (!this.bindings[nodeID]) {
            this.bindings[nodeID] = {};
          }
          this.bindings[nodeID][propName] = propValueArr[1];
        }
        if (propName === 'ref') {
          propValueArr[0] = 'function'
          const refName = propValueArr[1];
          propValueArr[1] = (node) => {
            this._idyllRefs[refName] = {
              scrollProgress: {
                x: 0,
                y: 0
              },
              domNode: () => ReactDOM.findDOMNode(node)
            }
          }
        }
      });
      if (children && children.map) {
        children.map(walkVars.bind(this));
      }
    }
  };

  return walkVars.bind(component);
}
