const React = require('react');
const htmlTags = require('html-tags');
const changeCase = require('change-case');
const componentClasses = {};//require('__IDYLL_COMPONENTS__');
const { COMPONENTS, PROPERTIES } = require('../constants');

const processComponent = (component, name, id) => {
  const split = name.split('.');
  const paramCaseName = changeCase.paramCase(split[0]);
  let componentClass;
  const extraProps = {};
  if (componentClasses[paramCaseName]) {
    componentClass = componentClasses[paramCaseName];
    for (var i = 1; i < split.length; i++) {
      componentClass = componentClass[split[i]];
    }
    extraProps.__handleUpdateProps = component.handleUpdateProps(id);
  } else if (htmlTags.indexOf(name.toLowerCase()) > -1) {
    componentClass = name.toLowerCase();
  }

  return {
    componentClass,
    extraProps
  };
}

const stringifyRefs = (refs) => {
  const output = {};
  const keys = ['scrollProgress', 'size', 'position'];
  Object.keys(refs).forEach((ref) => {
    const val = refs[ref];
    output[ref] = {};
    Object.keys(val).forEach((key) => {
      if (keys.indexOf(key) === -1) {
        return;
      }
      output[ref][key] = val[key];
    });
  });
  return JSON.stringify(output);
}

const filterPropsByComponentName = {
  meta: ['description'],
  p: []
};

module.exports = function(component) {
  let nodeID = -1;
  const walkNode = function (node) {
    nodeID++;
    if (typeof node === 'string') {
      return node;
    }

    const componentName = node[0];
    const filterProps = filterPropsByComponentName[componentName];
    const props = node[1];
    const children = node[2];
    if ([COMPONENTS.Variable, COMPONENTS.Dataset, COMPONENTS.Derived].indexOf(componentName) === -1) {
      const propsObj = {key: nodeID};

      props.forEach((propArr) => {
        const propName = propArr[0];
        if(filterProps && filterProps.indexOf(propName) !== -1) return;
        const propValueArr = propArr[1];
        if (propValueArr[0] === PROPERTIES.Variable) {
          propsObj[propName] = component.state[propValueArr[1]];
        } else if (propValueArr[0] === PROPERTIES.Expression) {

          if (propName.startsWith('on') || propName.startsWith('handle')) {
            let evalFunc = '(() => {';
            const relevantVars = [];
            const expression = propValueArr[1];
            Object.keys(component.state).forEach((propName) => {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              relevantVars.push(propName);
              const val = component.state[propName];
              evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
            });
            const dvs = component.getDerivedVars();
            Object.keys(dvs).forEach((propName) => {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              const val = dvs[propName];
              evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
            });
            evalFunc += `var refs = ${stringifyRefs(component._idyllRefs)};\n`;
            evalFunc += propValueArr[1];
            evalFunc += `\ncomponent.setStateAndDerived({${relevantVars.join(',')}});\n`;
            evalFunc += '})()';
            propsObj[propName] = (function() {
              eval(evalFunc);
            }).bind(component);
          } else {
            let evalFunc = '(() => {';
            const expression = propValueArr[1];
            Object.keys(component.state).forEach((propName) => {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              const val = component.state[propName];
              evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
            });
            const dvs = component.getDerivedVars();
            Object.keys(dvs).forEach((propName) => {
              if (expression.indexOf(propName) === -1) {
                return;
              }
              const val = dvs[propName];
              evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
            });
            evalFunc += `var refs = ${stringifyRefs(component._idyllRefs)};\n`;
            evalFunc += `var retVal; try { retVal = ${propValueArr[1]}; } catch (e) { /*console.log(e)*/ }; return retVal;\n`;
            evalFunc += '})()';
            propsObj[propName] = eval(evalFunc);
          }
        } else {
          propsObj[propName] = propValueArr[1];
        }
      });

      const results = processComponent(component, componentName, nodeID);

      const inputProps = Object.assign({}, results.extraProps, propsObj);
      if (children) {
        return React.createElement(results.componentClass, inputProps, children.length ? children.map(walkNode) : null);
      }
      return React.createElement(getComponentClass(componentName), inputProps);
    }
  };
  return walkNode;
}
