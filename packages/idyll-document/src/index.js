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
  walkSchema,
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
    triggers.push((v) => {
      this.setState({value: v.x})
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

class IdyllDocument extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleUpdateProps = this.handleUpdateProps.bind(this);

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
    this.derivedVars = getVars(derived, initialState);

    const state = this.state = {
      ...initialState,
      ...this.getDerivedVars()
    };

    // still sets up bindings and refs
    props.ast.map(walkVars(this, props.datasets));

    const rjs = new ReactJsonSchema();
    rjs.setComponentMap({...props.componentClasses, Wrapper});
    const schema = translate(props.ast);

    const wrapTargets = findWrapTargets(schema, this.state);

    const transformedSchema = walkSchema(
      node => true,
      schema,
      node => {
        if (!wrapTargets.includes(node) || typeof node === 'string') return node;

        const {component, children, key, ...props} = node;

        Object.keys(props).forEach(k => {
          if (state.hasOwnProperty(node[k])) {
            node[k] = state[node[k]]; // update the initial value
          }
        })

        node.updateProps = (newProps) => {
          // TODO: calculate the correct objects to send
          triggers.forEach(f => f({x: newProps.value}))
        }

        return {
          component: Wrapper,
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

  handleUpdateProps(nodeID) {
    if (!this.updateFuncCache[nodeID]) {
      this.updateFuncCache[nodeID] = (props) => {
        if (this.bindings[nodeID]) {
          const newState = {};
          Object.keys(props).forEach((propName) => {
            const val = props[propName];
            if (this.bindings[nodeID][propName]) {
              newState[this.bindings[nodeID][propName]] = val;
            }
          });
          this.setStateAndDerived(newState);
        }
      };
    }

    return this.updateFuncCache[nodeID];
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
