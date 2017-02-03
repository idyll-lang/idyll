const fs = require('fs');
const file = fs.readFileSync(process.env.IDL_FILE, "utf8");
const grammar = require('idyll-grammar');
const nearley = require("nearley");
const React = require('react');
const ReactDOM = require('react-dom');
const changeCase = require('change-case');
const htmlTags = require('html-tags');
const bulk = require('bulk-require');

// Require all of the components up front...
// this is not ideal!
const defaultComponents = bulk(process.env.IDYLL_PATH + '/components', [ '**/*.js' ]);
const customComponents = bulk(process.env.COMPONENTS_FOLDER, [ '**/*.js' ]);

// Create a Parser object from our grammar.
const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

let processedFile = file.replace(/\n\s*\n/g, "[br /]");
processedFile = file.replace(/\n/g, " ");
processedFile = file.replace(/(\])(\s+)(\[)/g, "$1$3");

// Parse something
p.feed(processedFile);
const results = p.results;

if (results.length) {
  console.log('Successfully parsed file.');

  results.forEach((result) => {
    console.log(result);
  });
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
      if (node[0] === NODES.Component) {
        const componentName = node[1];
        if (componentName === COMPONENTS.Variable) {
          const props = node[2];
          const children = node[3];
          let varName, varVal;
          props.forEach((propArr) => {
            const propName = propArr[0];
            const propValueArr = propArr[1];
            switch (propName) {
              case VARIABLE.Name:
                varName = propValueArr[1];
                break;
              case VARIABLE.Value:
                varVal = propValueArr[1];
                break;
            }
          });
          initialState[varName] = varVal;
        } else {
          const props = node[2];
          const children = node[3];
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

          children.map(walkVars);
        }
      }
    };

    results[0].map(walkVars);
    this.state = initialState;

    nodeID = -1;
    const walkNode = (node) => {
      nodeID++;
      if (node[0] === NODES.Text) {
        if (node[1].trim() === '') {
          if ((node[1].match(/\n/g) || []).length > 1) {
            return <br key={nodeID} />;
          }
          return null;
        }
        return (
          <p key={nodeID}>
            {node[1]}
          </p>
        );
      } else if (node[0] === NODES.Component) {
        const componentName = node[1];
        if (componentName !== COMPONENTS.Variable) {
          const props = node[2];
          const children = node[3];
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

          return React.createElement(getComponentClass(componentName), propsObj, children.map(walkNode));
        }
      }
    };

    this.getChildren = () => {
      nodeID = -1;
      return results[0].map(walkNode.bind(this));
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
