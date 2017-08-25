const React = require('react');
const walkVars = require('./visitors/vars');
const walkNode = require('./visitors/node');
const ReactJsonSchema = require('./utils/schema2element').default;
const {
  flattenObject,
  getData,
  getNodesByName,
  getVars,
  splitAST,
  translate,
  findWrapTargets,
  mapTree,
  evalExpression,
} = require('./utils');

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

const triggers = []

class Wrapper extends React.PureComponent {
  constructor() {
    super()
    triggers.push((newState) => {
      let nextState = {}
      Object.keys(this.props.stateKeys).forEach(key => {
        nextState[key] = newState[this.props.stateKeys[key]]
      })
      Object.keys(this.props.exprs).forEach(key => {
        nextState[key] = evalExpression(newState, this.props.exprs[key])
      })
      this.setState(nextState)
    })
  }

  render() {
    return (
      <span style={{backgroundColor: 'deepskyblue'}}>
        {
          React.Children.map(this.props.children, c => {
            return React.cloneElement(c, {...this.state})
          })
        }
      </span>
    )
  }
}

const getDerivedValues = dVars => {
  const o = {}
  Object.keys(dVars).forEach(key => o[key] = dVars[key].value)
  return o
}

class IdyllDocument extends React.PureComponent {
  constructor(props) {
    super(props);

    // Walk the tree, creating the proper components for evererything.
    this.bindings = {};
    this._idyllRefs = {};
    this.updateFuncCache = {};

    const {
      vars,
      derived,
      data,
      elements,
    } = splitAST(props.ast);

    const initialState = {
      ...getVars(vars),
      ...getData(data, props.datasets)
    };
    const derivedVars = this.derivedVars = getVars(derived, initialState);

    let state = this.state = {
      ...initialState,
      ...getDerivedValues(derivedVars)
    };

    // still sets up bindings and refs
    props.ast.map(walkVars(this, props.datasets));

    const rjs = new ReactJsonSchema();
    rjs.setComponentMap({...props.componentClasses, Wrapper});
    const schema = translate(props.ast);

    const wrapTargets = findWrapTargets(schema, this.state);

    const transformedSchema = mapTree(
      schema,
      node => {
        if (!wrapTargets.includes(node) || typeof node === 'string') return node;

        const {component, children, key, __expressions = [], ...props} = node;
        const stateKeys = {}
        const exprs = {}

        Object.keys(props).forEach(k => {
          const stateKey = node[k]
          if (__expressions.includes(k)) {
            exprs[k] = stateKey;
            node[k] = evalExpression(state, stateKey); // assign the initial value
          } else if (state.hasOwnProperty(stateKey)) {
            // track which state vars affect this node
            stateKeys[k] = stateKey
            node[k] = state[stateKey]; // assign the initial value
          }
        })

        node.updateProps = (newProps) => {
          const newState = {}
          Object.keys(newProps).forEach(k => {
            if (stateKeys[k]) {
              const stateKey = stateKeys[k]
              newState[stateKey] = newProps[k]
            }
          })
          const newMergedState = {...state, ...newState};
          const newDerivedValues = getDerivedValues(
            getVars(derived, newMergedState)
          )
          const newDocState = {...newMergedState, ...newDerivedValues}

          // update doc state
          state = newDocState;

          triggers.forEach(f => f(newDocState))
        }

        return {
          component: Wrapper,
          stateKeys,
          exprs,
          children: [
            node
          ]
        }
      },
    );

    const kids = rjs.parseSchema({
      component: 'div',
      className: 'idyll-root',
      children: transformedSchema
    });

    this.getChildren = () => {
      return kids;
    }
  }

  updateDerivedVars(newState) {
    Object.keys(this.derivedVars).forEach((dv) => {
      this.derivedVars[dv].value = this.derivedVars[dv].update(newState, this.state);
    });
  }

  setStateAndDerived(newState) {
    this.updateDerivedVars(newState);
    this.setState(newState);
  }

  getDerivedVars() {
    let dvs = {};
    Object.keys(this.derivedVars).forEach((dv) => {
      dvs[dv] = this.derivedVars[dv].value;
    });
    return dvs;
  }

  componentDidMount() {
    const refKeys = Object.keys(this._idyllRefs);
    if (!refKeys.length) {
      return;
    }
    refKeys.forEach((name) => {
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
    return this.getChildren();
  }
}

module.exports = IdyllDocument;
