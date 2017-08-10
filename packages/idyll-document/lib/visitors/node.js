'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var htmlTags = require('html-tags');
var changeCase = require('change-case');
var memoize = require('memoizee');

var _require = require('../constants'),
    COMPONENTS = _require.COMPONENTS,
    PROPERTIES = _require.PROPERTIES;

var stringifyRefs = function stringifyRefs(refs) {
  var output = {};
  var keys = ['scrollProgress', 'size', 'position'];
  Object.keys(refs).forEach(function (ref) {
    var val = refs[ref];
    output[ref] = {};
    Object.keys(val).forEach(function (key) {
      if (keys.indexOf(key) === -1) {
        return;
      }
      output[ref][key] = val[key];
    });
  });
  return JSON.stringify(output);
};

var filterPropsByComponentName = {
  meta: ['description'],
  p: []
};

module.exports = function (component, componentClasses) {

  var processComponent = memoize(function (name, id) {
    var split = name.split('.');
    var paramCaseName = changeCase.paramCase(split[0]);
    var componentClass = void 0;
    if (componentClasses[paramCaseName]) {
      componentClass = componentClasses[paramCaseName];
      for (var i = 1; i < split.length; i++) {
        componentClass = componentClass[split[i]];
      }
      if (typeof componentClass !== 'string') {
        var update = component.handleUpdateProps(id);

        if (componentClass.default) {
          return function (_componentClass$defau) {
            _inherits(_class, _componentClass$defau);

            function _class() {
              _classCallCheck(this, _class);

              return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
              key: 'updateProps',
              value: function updateProps(newProps) {
                return update.call(this, newProps);
              }
            }]);

            return _class;
          }(componentClass.default);
        }

        return function (_componentClass) {
          _inherits(_class2, _componentClass);

          function _class2() {
            _classCallCheck(this, _class2);

            return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
          }

          _createClass(_class2, [{
            key: 'updateProps',
            value: function updateProps(newProps) {
              return update.call(this, newProps);
            }
          }]);

          return _class2;
        }(componentClass);
      }
    } else if (htmlTags.indexOf(name.toLowerCase()) > -1) {
      componentClass = name.toLowerCase();
    }

    return componentClass;
  });

  var nodeID = -1;
  var walkNode = function walkNode(node) {
    nodeID++;
    if (typeof node === 'string') {
      return node;
    }

    var componentName = node[0];
    var filterProps = filterPropsByComponentName[componentName];
    var props = node[1];
    var children = node[2];
    if ([COMPONENTS.Variable, COMPONENTS.Dataset, COMPONENTS.Derived].indexOf(componentName) === -1) {
      var propsObj = { key: nodeID };

      props.forEach(function (propArr) {
        var propName = propArr[0];
        if (filterProps && filterProps.indexOf(propName) !== -1) return;
        var propValueArr = propArr[1];
        if (propValueArr[0] === PROPERTIES.Variable) {
          propsObj[propName] = component.state[propValueArr[1]];
        } else if (propValueArr[0] === PROPERTIES.Expression) {

          if (propName.startsWith('on') || propName.startsWith('handle')) {
            var evalFunc = '(() => {';
            var relevantVars = [];
            var expression = propValueArr[1];
            Object.keys(component.state).forEach(function (propName) {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              relevantVars.push(propName);
              var val = component.state[propName];
              evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
            });
            var dvs = component.getDerivedVars();
            Object.keys(dvs).forEach(function (propName) {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              var val = dvs[propName];
              evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
            });
            evalFunc += 'var refs = ' + stringifyRefs(component._idyllRefs) + ';\n';
            evalFunc += propValueArr[1];
            evalFunc += '\ncomponent.setStateAndDerived({' + relevantVars.join(',') + '});\n';
            evalFunc += '})()';
            propsObj[propName] = function () {
              eval(evalFunc);
            }.bind(component);
          } else {
            var _evalFunc = '(() => {';
            var _expression = propValueArr[1];
            Object.keys(component.state).forEach(function (propName) {
              if (_expression.indexOf(propName) === -1) {
                return;
              }
              var val = component.state[propName];
              _evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
            });
            var _dvs = component.getDerivedVars();
            Object.keys(_dvs).forEach(function (propName) {
              if (_expression.indexOf(propName) === -1) {
                return;
              }
              var val = _dvs[propName];
              _evalFunc += 'var ' + propName + ' = ' + JSON.stringify(val) + ';\n';
            });
            _evalFunc += 'var refs = ' + stringifyRefs(component._idyllRefs) + ';\n';
            _evalFunc += 'var retVal; try { retVal = ' + propValueArr[1] + '; } catch (e) { /*console.log(e)*/ }; return retVal;\n';
            _evalFunc += '})()';
            propsObj[propName] = eval(_evalFunc);
          }
        } else {
          propsObj[propName] = propValueArr[1];
        }
      });

      var componentClass = processComponent(componentName, nodeID);
      return React.createElement(componentClass, propsObj, children && children.length ? children.map(walkNode) : undefined);
    }
  };

  var getWalker = function getWalker() {
    nodeID = -1;
    return walkNode;
  };

  return getWalker;
};