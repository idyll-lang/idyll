const React = require('react');
const ReactDOM = require('react-dom');
const changeCase = require('change-case');
const htmlTags = require('html-tags');
const bulk = require('bulk-require');
const datasets = bulk(process.env.DATA_FOLDER, [ '**/*.json' ]);
const componentClasses = require(process.env.COMPONENT_FILE);
let results = require(process.env.AST_FILE);

if (results.length) {
  console.log('Successfully parsed file.');
}

const COMPONENTS = {
  Variable: 'var',
  Dataset: 'data'
};

const PROPERTIES = {
  Expression: 'expression',
  Variable: 'variable',
  Value: 'value',
  Function: 'function'
};

const VARIABLE = {
  Name: 'name',
  Value: 'value'
};

const DATASET = {
  Name: 'name',
  Source: 'source'
};

const processComponent = (name) => {
  const paramCaseName = changeCase.paramCase(name);
  let componentClass;
  const extraProps = {};

  if (componentClasses[paramCaseName]) {
    componentClass = componentClasses[paramCaseName];
  } else if (htmlTags.indexOf(paramCaseName) > -1) {
    componentClass = paramCaseName;
  } else {
    componentClass = 'div';
    extraProps.className = name.toLowerCase();
  }

  return {
    componentClass,
    extraProps
  };
}

const flattenObject = (name, obj) => {
  const output = {};
  if (obj === undefined || obj === null) {
    return output;
  }
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val === 'object') {
      const results = flattenObject(key, val);
      Object.keys(results).forEach((result) => {
        output[name + result] = results[result];
      });
    } else {
      output[name + key] = val;
    }
  });
  return output;
};

const transformRefs = (refs) => {
  const output = {};
  const keys = ['scrollProgress', 'size', 'position'];
  Object.keys(refs).forEach((ref) => {
    const val = refs[ref];
    keys.forEach((key) => {
      if (val === null || val === undefined) {
        return;
      }
      const results = flattenObject(key, val[key]);
      Object.keys(results).forEach((result) => {
        output['_idyllRefs' + ref + result] = results[result];
      });
    });
  });
  return output;
};

const stringifyRefs = (refs) => {
  console.log('stringify refs:');
  console.log(refs);
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
  console.log(output);
  return JSON.stringify(output);
}

class InteractiveDocument extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleUpdateProps = this.handleUpdateProps.bind(this);

    // Walk the tree, creating the proper components for evererything.
    this.bindings = {};
    this._idyllRefs = {};
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
      if (componentName === COMPONENTS.Dataset) {
        let varName, varVal;
        props.forEach((propArr) => {
          const propName = propArr[0];
          const propValueArr = propArr[1];
          switch (propName) {
            case DATASET.Name:
              varName = propValueArr[1];
              break;
            case DATASET.Source:
              const source = propValueArr[1];
              const cleanedSource = source.endsWith('.json') ? source.slice(0, -4) : source;
              varVal = datasets[cleanedSource];
              break;
          }
        });
        initialState[varName] = varVal;
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
                  varVal = initialState[propValueArr[1]];
                  break;
                case PROPERTIES.Expression:
                  let evalFunc = '(() => {';
                  const expression = propValueArr[1];
                  Object.keys(initialState).forEach((propName) => {
                    if (expression.indexOf(propName) === -1) {
                      return;
                    }
                    const val = initialState[propName];
                    evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
                  });
                  evalFunc += 'return ' + propValueArr[1] + ';';
                  evalFunc += '})()';
                  varVal = eval(evalFunc);
                  break;
              }
          }
        });
        initialState[varName] = varVal;
      } else {
        const propsObj = {key: nodeID, __handleUpdateProps: this.handleUpdateProps(nodeID)};
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

        if (children) {
          children.map(walkVars);
        }
      }
    };
    results.map(walkVars);

    nodeID = -1;
    this.state = initialState;
    const walkNode = (node) => {
      nodeID++;
      if (typeof node === 'string') {
        return node;
      }

      const componentName = node[0];
      const props = node[1];
      const children = node[2];
      if (componentName !== COMPONENTS.Variable && componentName !== COMPONENTS.Dataset) {
        const propsObj = {key: nodeID, __handleUpdateProps: this.handleUpdateProps(nodeID)};

        props.forEach((propArr) => {
          const propName = propArr[0];
          const propValueArr = propArr[1];
          if (propValueArr[0] === PROPERTIES.Variable) {
            propsObj[propName] = this.state[propValueArr[1]];
          } else if (propValueArr[0] === PROPERTIES.Expression) {
            if (propName.startsWith('on') || propName.startsWith('handle')) {
              let evalFunc = '(() => {';
              const relevantVars = [];
              const expression = propValueArr[1];
              Object.keys(this.state).forEach((propName) => {
                if (expression.indexOf(propName) === -1) {
                  return;
                }
                relevantVars.push(propName);
                const val = this.state[propName];
                evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
              });
              evalFunc += `var refs = ${stringifyRefs(this._idyllRefs)};\n`;
              evalFunc += propValueArr[1];
              evalFunc += `\nthis.setState({${relevantVars.join(',')}});\n`;
              evalFunc += '})()';
              propsObj[propName] = (function() {
                eval(evalFunc);
              }).bind(this);
            } else {
              let evalFunc = '(() => {';
              const expression = propValueArr[1];
              Object.keys(this.state).forEach((propName) => {
                if (expression.indexOf(propName) === -1) {
                  return;
                }
                const val = this.state[propName];
                evalFunc += `var ${propName} = ${JSON.stringify(val)};\n`;
              });
              evalFunc += `var refs = ${stringifyRefs(this._idyllRefs)};\n`;
              evalFunc += `var retVal; try { retVal = ${propValueArr[1]}; } catch (e) { /*console.log(e)*/ }; return retVal;\n`;
              evalFunc += '})()';
              propsObj[propName] = eval(evalFunc);
            }
          } else {
            propsObj[propName] = propValueArr[1];
          }
        });

        const results = processComponent(componentName);
        const inputProps = Object.assign({}, results.extraProps, propsObj);
        if (children) {
          return React.createElement(results.componentClass, inputProps, children.length ? children.map(walkNode) : null);
        }
        return React.createElement(getComponentClass(componentName), inputProps);
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

  componentDidMount() {
    Object.keys(this._idyllRefs).forEach((name) => {
      const ref = this._idyllRefs[name];
      const rect = ref.domNode().getBoundingClientRect();
      this._idyllRefs[name]._node = ref.domNode();
      this._idyllRefs[name].size = {
        x: rect.width,
        y: rect.height
      };

      this._idyllRefs[name].position = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom:  rect.bottom
      };

      this._idyllRefs[name].absolutePosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        bottom:  rect.bottom + window.scrollY
      };

    });
    this.setState(transformRefs(this._idyllRefs));

    window.addEventListener('scroll', (e) => {
      // calculate current position based on scroll position
      const body = document.body;
      const html = document.documentElement;
      const documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
      const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const newRefs = {};
      Object.keys(this._idyllRefs).forEach((ref) => {
        const { size, absolutePosition, _node } = this._idyllRefs[ref];

        // 0 percent === top of the div is over the bottom of the window
        const minY = Math.max(0, absolutePosition.top - windowHeight);
        // 100 percent === bottom of div is at top of window
        const maxY = Math.min(documentHeight - windowHeight, absolutePosition.bottom);

        const minX = Math.max(0, absolutePosition.left - windowWidth);
        const maxX = Math.min(documentWidth - windowWidth, absolutePosition.right);

        const rect = _node.getBoundingClientRect();
        newRefs[ref] = {
          scrollProgress: {
            x: minX === maxX ? 1 : Math.max(0, Math.min(1, (scrollX - minX) / (maxX - minX))),
            y: minY === maxY ? 1 : Math.max(0, Math.min(1, (scrollY - minY) / (maxY - minY)))
          },
          position: {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom:  rect.bottom
          } 
        };
        this._idyllRefs[ref] = Object.assign({}, this._idyllRefs[ref], newRefs[ref]);
      });

      this.setState(transformRefs(newRefs));
    });
  }

  render() {
    return (<div className="article">{this.getChildren()}</div>);
  }
}

var mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<InteractiveDocument />, mountNode);
