'use strict';

var ReactDOM = require('react-dom');

var _require = require('../constants'),
    COMPONENTS = _require.COMPONENTS,
    DATASET = _require.DATASET,
    PROPERTIES = _require.PROPERTIES,
    DERIVED = _require.DERIVED,
    VARIABLE = _require.VARIABLE;

module.exports = function (component, datasets) {
  var nodeID = -1;
  var walkVars = function walkVars(node) {
    var _this = this;

    nodeID++;
    if (typeof node === 'string') {
      return;
    }

    var componentName = node[0];
    var props = node[1];
    var children = node[2];
    if (componentName === COMPONENTS.Dataset) {
      var varName = void 0,
          varVal = void 0;
      props.forEach(function (propArr) {
        var propName = propArr[0];
        var propValueArr = propArr[1];
        switch (propName) {
          case DATASET.Name:
            varName = propValueArr[1];
            varVal = datasets[varName];
            break;
        }
      });
      this.initialState[varName] = varVal;
    } else if (componentName === COMPONENTS.Variable) {
      var _varName = void 0,
          _varVal = void 0;
      props.forEach(function (propArr) {
        var propName = propArr[0];
        var propValueArr = propArr[1];
        switch (propName) {
          case VARIABLE.Name:
            _varName = propValueArr[1];
            break;
          case VARIABLE.Value:
            switch (propValueArr[0]) {
              case PROPERTIES.Value:
                _varVal = propValueArr[1];
                break;
              case PROPERTIES.Variable:
                _varVal = _this.initialState[propValueArr[1]];
                break;
              case PROPERTIES.Expression:
                var evalFunc = '(() => {';
                var expression = propValueArr[1];
                Object.keys(_this.initialState).forEach(function (propName) {
                  if (expression.indexOf(propName) === -1) {
                    return;
                  }
                  var val = _this.initialState[propName];
                  evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
                });
                evalFunc += 'return ' + propValueArr[1] + ';';
                evalFunc += '})()';
                _varVal = eval(evalFunc);
                break;
            }
        }
      });
      this.initialState[_varName] = _varVal;
    } else if (componentName === COMPONENTS.Derived) {
      var _varName2 = void 0,
          getFunc = void 0;
      props.forEach(function (propArr) {
        var propName = propArr[0];
        var propValueArr = propArr[1];
        switch (propName) {
          case DERIVED.Name:
            _varName2 = propValueArr[1];
            break;
          case DERIVED.Value:
            switch (propValueArr[0]) {
              case PROPERTIES.Value:
              case PROPERTIES.Variable:
                console.warn('Derived value should be an expression');
                break;
              case PROPERTIES.Expression:
                getFunc = function getFunc(state) {
                  var evalFunc = '(() => {';
                  var expression = propValueArr[1];
                  Object.keys(state).forEach(function (propName) {
                    if (expression.indexOf(propName) === -1) {
                      return;
                    }
                    var val = state[propName];
                    evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
                  });
                  evalFunc += 'return ' + propValueArr[1] + ';';
                  evalFunc += '})()';
                  return evalFunc;
                };
                break;
            }
        }
      });
      this.derivedVars[_varName2] = {
        value: eval(getFunc(Object.assign({}, this.initialState, this.getDerivedVars()))),
        update: function update(newState) {
          _this.derivedVars[_varName2].value = eval(getFunc(Object.assign({}, _this.state, newState, _this.getDerivedVars())));
        }
      };
    } else {
      props.forEach(function (propArr, i) {
        var propName = propArr[0];
        var propValueArr = propArr[1];
        if (propValueArr[0] === PROPERTIES.Variable) {
          if (!_this.bindings[nodeID]) {
            _this.bindings[nodeID] = {};
          }
          _this.bindings[nodeID][propName] = propValueArr[1];
        }
        if (propName === 'ref') {
          propValueArr[0] = 'function';
          var refName = propValueArr[1];
          propValueArr[1] = function (node) {
            _this._idyllRefs[refName] = {
              scrollProgress: {
                x: 0,
                y: 0
              },
              domNode: function domNode() {
                return ReactDOM.findDOMNode(node);
              }
            };
          };
        }
      });
      if (children && children.map) {
        children.map(walkVars.bind(this));
      }
    }
  };

  return walkVars.bind(component);
};