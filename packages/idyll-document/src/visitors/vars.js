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
