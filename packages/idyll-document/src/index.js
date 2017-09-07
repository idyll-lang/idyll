const React = require('react');
const ReactDOM = require('react-dom');
const scrollMonitor = require('scrollmonitor');
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

const updatePropsCallbacks = [];
const updateRefsCallbacks = [];
const scrollWatchers = [];
let scrollContainer;

const getScrollableContainer = el => {
  if (el.scrollHeight > el.offsetHeight) return el;
  return getScrollableContainer(el.parentNode);
};

const getRefs = () => {
  const refs = {};

  scrollWatchers.forEach(watcher => {
    // get boolean props
    let bools = {};
    Object.keys(watcher).forEach(key => {
      if (!key.startsWith('is')) return;
      bools[key] = watcher[key];
    });

    const domNode = watcher.watchItem;
    const rect = domNode.getBoundingClientRect();
    const containerNode = scrollContainer.item;
    const containerRect = containerNode.getBoundingClientRect();

    // left and right props assume no horizontal scrolling
    refs[domNode.dataset.ref] = {
      ...bools,
      domNode,
      size: {
        width: rect.width,
        height: rect.height,
      },
      position: {
        top: watcher.top - scrollContainer.viewportTop,
        right: rect.right - containerRect.left,
        bottom: watcher.bottom - scrollContainer.viewportTop,
        left: rect.left - containerRect.left,
      },
      absolutePosition: {
        top: watcher.top,
        right: rect.right,
        bottom: watcher.bottom,
        left: rect.left,
      },
    };
  });

  return refs;
};

const _get = (o, path) => {
  let val = o;
  while (path.length) {
    val = val[path.shift()];
  }
  return val;
};

class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onUpdateRefs = this.onUpdateRefs.bind(this);
    this.onUpdateProps = this.onUpdateProps.bind(this);

    const vars = Object.values(props.__vars__);
    const exps = Object.values(props.__expr__);

    // listen for props updates IF we care about them
    if (vars.length || exps.some(v => !v.includes('refs.'))) {
      // called with new doc state
      // when any component calls updateProps()
      updatePropsCallbacks.push(this.onUpdateProps);
    }

    // listen for ref updates IF we care about them
    if (exps.some(v => v.includes('refs.'))) {
      updateRefsCallbacks.push(this.onUpdateRefs);
    }
  }

  onUpdateProps(newState, changedKeys) {
    const { __vars__, __expr__ } = this.props;

    // were there changes to any vars we track?
    // or vars our expressions reference?
    const shouldUpdate = changedKeys.some(k => {
      return (
        Object.values(__vars__).includes(k) ||
        Object.values(__expr__).some(expr => expr.includes(k))
      );
    });
    // if nothing we care about changed bail out and don't re-render
    if (!shouldUpdate) return;

    // update this component's state
    const nextState = {};
    // pull in the latest value for any tracked vars
    Object.keys(__vars__).forEach(key => {
      nextState[key] = newState[__vars__[key]];
    });
    // re-run this component's expressions using the latest doc state
    Object.keys(__expr__).forEach(key => {
      nextState[key] = evalExpression(newState, __expr__[key]);
    });
    // trigger a re-render of this component
    // and more importantly, its wrapped component
    this.setState(nextState);
  }

  onUpdateRefs(refs) {
    const nextState = {};
    Object.entries(this.props.__expr__).forEach(([key, val]) => {
      nextState[key] = _get(refs, val.split('.').slice(1));
    });
    this.setState(nextState);
  }

  componentWillUnmount() {
    const propsIndex = updatePropsCallbacks.indexOf(this.onUpdateProps);
    if (propsIndex > -1) updatePropsCallbacks.splice(propsIndex, 1);

    const refsIndex = updateRefsCallbacks.indexOf(this.onUpdateRefs);
    if (refsIndex > -1) updateRefsCallbacks.splice(refsIndex, 1);
  }

  render() {
    return (
      <span style={{backgroundColor: 'deepskyblue'}}>
        {
          React.Children.map(this.props.children, c => {
            return React.cloneElement(c, {...this.state});
          })
        }
      </span>
    );
  }
}

const getDerivedValues = dVars => {
  const o = {};
  Object.keys(dVars).forEach(key => o[key] = dVars[key].value);
  return o;
};

class IdyllDocument extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initScrollListener = this.initScrollListener.bind(this);

    const {
      vars,
      derived,
      data,
      elements,
    } = splitAST(props.ast);

    const initialState = {
      ...getVars(vars),
      ...getData(data, props.datasets),
    };
    const derivedVars = this.derivedVars = getVars(derived, initialState);

    let state = this.state = {
      ...initialState,
      ...getDerivedValues(derivedVars),
    };

    const rjs = new ReactJsonSchema();
    rjs.setComponentMap({...props.componentClasses, Wrapper});
    const schema = translate(props.ast);

    const wrapTargets = findWrapTargets(schema, this.state);

    const transformedSchema = mapTree(
      schema,
      node => {
        // transform refs from strings to functions and store them
        if (typeof node !== 'string' && node.ref) {
          const refName = node.ref;
          node.className = 'is-ref';
          node.ref = el => {
            if (!el) return;

            const domNode = ReactDOM.findDOMNode(el);
            domNode.dataset.ref = refName;
          };
        }

        if (!wrapTargets.includes(node) || typeof node === 'string') return node;

        const {
          component,
          children,
          key,
          __vars__ = {},
          __expr__ = {},
          ...props // actual component props
        } = node;

        // assign the initial values for tracked vars and expressions
        Object.keys(props).forEach(k => {
          if (__vars__[k]) {
            node[k] = state[__vars__[k]];
          }
          if (__expr__[k] && !__expr__[k].includes('refs.')) {
            node[k] = evalExpression(state, __expr__[k]);
          }
        });

        // define the function wrapped components will call via this.props.updateProps
        node.updateProps = (newProps) => {
          // init new doc state object
          const newState = {};
          // iterate over passed in updates
          Object.keys(newProps).forEach(k => {
            // if a tracked var was updated get its new value
            if (__vars__[k]) {
              newState[__vars__[k]] = newProps[k];
            }
          });
          // merge new doc state with old
          const newMergedState = {...state, ...newState};
          // update derived values
          const newDerivedValues = getDerivedValues(
            getVars(derived, newMergedState),
          );

          const nextState = {...newMergedState, ...newDerivedValues};
          const changedKeys = Object.keys(state).reduce(
            (acc, k) => {
              if (state[k] !== nextState[k]) acc.push(k);
              return acc;
            },
            []
          )

          // update doc state reference
          state = { ...nextState, refs: this.state.refs };

          // pass the new doc state to all listeners aka component wrappers
          updatePropsCallbacks.forEach(f => f(state, changedKeys));
        };

        return {
          component: Wrapper,
          __vars__,
          __expr__,
          children: [
            node
          ],
        };
      }
    );

    this.kids = (
      <div className="idyll-root" ref={this.initScrollListener}>
        {rjs.parseSchema(transformedSchema)}
      </div>
    );
  }

  initScrollListener(el) {
    if (!el) return;

    const scroller = getScrollableContainer(el) || window;
    scrollContainer = scrollMonitor.createContainer(scroller);
    Array.from(document.getElementsByClassName('is-ref')).forEach(ref => {
      scrollWatchers.push(scrollContainer.create(ref));
    });
    scroller.addEventListener('scroll', e => {
      const refs = getRefs();
      updateRefsCallbacks.forEach(f => f(refs));
    });
  }

  updateDerivedVars(newState) {
    Object.keys(this.derivedVars).forEach(dv => {
      this.derivedVars[dv].value = this.derivedVars[dv].update(
        newState,
        this.state,
      );
    });
  }

  getDerivedVars() {
    let dvs = {};
    Object.keys(this.derivedVars).forEach(dv => {
      dvs[dv] = this.derivedVars[dv].value;
    });
    return dvs;
  }

  componentDidMount() {
    const refs = getRefs();
    updateRefsCallbacks.forEach(f => f(refs));
  }

  render() {
    return this.kids;
  }
}

module.exports = IdyllDocument;
