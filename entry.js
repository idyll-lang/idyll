const fs = require('fs');
const file = fs.readFileSync(process.env.IDL_FILE, "utf8");
const compile = require('idyll-compiler');
const React = require('react');
const ReactDOM = require('react-dom');
const changeCase = require('change-case');
const htmlTags = require('html-tags');
const bulk = require('bulk-require');

// Require all of the components up front...
// this is not ideal!
const defaultComponents = bulk(process.env.IDYLL_PATH + '/components', [ '**/*.js' ]);
const customComponents = bulk(process.env.COMPONENTS_FOLDER, [ '**/*.js' ]);

const results = compile(file);

if (results.length) {
  console.log('Successfully parsed file.');
}

const NODES = {
  Text: 'text',
  Component: 'component'
};

const COMPONENTS = {
  Variable: 'var',
  Dataset: 'data'
};

const PROPERTIES = {
  Expression: 'expression',
  Variable: 'variable',
  Value: 'value'
};

const VARIABLE = {
  Name: 'name',
  Value: 'value'
};

const getComponentClass = (name) => {
  const paramCaseName = changeCase.paramCase(name);

  if (customComponents[paramCaseName]) {
    return customComponents[paramCaseName];
  }

  if (defaultComponents[paramCaseName]) {
    return defaultComponents[paramCaseName];
  }

  if (htmlTags.indexOf(paramCaseName) > -1) {
    return paramCaseName;
  }

  return 'div';
}


class InteractiveDocument extends React.Component {

  constructor(props) {
    super(props);
    this.handleUpdateProps = this.handleUpdateProps.bind(this);

    // Walk the tree, creating the proper components for evererything.
    this.bindings = {};
    const initialState = {};

    let nodeID = -1;
    const walkVars = (node) => {
      nodeID++;

      if (typeof node === 'string') {
        return;
      }

      const componentName = node[0];
      const props = node[1];
      const children = node[2];
      if (componentName === COMPONENTS.Variable) {
        let varName, varVal;
        props.forEach((propArr) => {
          const propName = propArr[0];
          const propValueArr = propArr[1];
          switch (propName) {
            case VARIABLE.Name:
              varName = propValueArr[1];
              break;
            case VARIABLE.Value:
              varVal = eval(propValueArr[1]);
              break;
          }
        });
        initialState[varName] = varVal;
      } else {
        const propsObj = {key: nodeID, __handleUpdateProps: this.handleUpdateProps(nodeID)};
        props.forEach((propArr) => {
          const propName = propArr[0];
          const propValueArr = propArr[1];
          if (propValueArr[0] === PROPERTIES.Variable) {
            if (!this.bindings[nodeID]) {
              this.bindings[nodeID] = {};
            }
            this.bindings[nodeID][propName] = propValueArr[1];
          }
        });

        if (children) {
          children.map(walkVars);
        }
      }
    };

    results.map(walkVars);
    this.state = initialState;

    nodeID = -1;
    const walkNode = (node) => {
      nodeID++;
      if (typeof node === 'string') {
        return node;
      }

      const componentName = node[0];
      const props = node[1];
      const children = node[2];
      if (componentName !== COMPONENTS.Variable) {
        const propsObj = {key: nodeID, __handleUpdateProps: this.handleUpdateProps(nodeID)};
        props.forEach((propArr) => {
          const propName = propArr[0];
          const propValueArr = propArr[1];
          if (propValueArr[0] === PROPERTIES.Variable) {
            propsObj[propName] = this.state[propValueArr[1]];
          } else if (propValueArr[0] === PROPERTIES.Expression) {
            let evalFunc = '(() => {';
            Object.keys(this.state).forEach((propName) => {
              const val = this.state[propName];
              evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
            });
            evalFunc += propValueArr[1];
            evalFunc += `\nthis.setState({${Object.keys(this.state).join(',')}});\n`;
            evalFunc += '})()';

            propsObj[propName] = (function() {
              eval(evalFunc);
            }).bind(this);
          } else {
            propsObj[propName] = propValueArr[1];
          }
        });

        if (children) {
          return React.createElement(getComponentClass(componentName), propsObj, children.map(walkNode));
        }
        return React.createElement(getComponentClass(componentName), propsObj);
      }
    };

    this.getChildren = () => {
      nodeID = -1;
      return results.map(walkNode.bind(this));
    }
  }

  handleUpdateProps(nodeID) {
    return (props) => {
      if (this.bindings[nodeID]) {
        const newState = {};
        Object.keys(props).forEach((propName) => {
          const val = props[propName];
          if (this.bindings[nodeID][propName]) {
            newState[this.bindings[nodeID][propName]] = val;
          }
        });
        this.setState(newState);
      }
    };
  }

  render() {
    return (<div className="article">{this.getChildren()}</div>);
  }
}

var mountNode = document.createElement('div');
document.body.appendChild(mountNode);


ReactDOM.render(<InteractiveDocument />, mountNode);
