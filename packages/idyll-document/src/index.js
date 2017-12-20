import React from 'react';
import ReactDOM from 'react-dom';
import scrollparent from 'scrollparent';
import scrollMonitor from 'scrollmonitor';
import ReactJsonSchema from './utils/schema2element';
import entries from 'object.entries';
import values from 'object.values';
import {
  getData,
  getVars,
  filterASTForDocument,
  splitAST,
  translate,
  findWrapTargets,
  mapTree,
  evalExpression,
  hooks,
  scrollMonitorEvents
} from './utils';

const updatePropsCallbacks = [];
const updateRefsCallbacks = [];
const scrollWatchers = [];
const scrollOffsets = {};
const refCache = {};
const evalContext = {};
let scrollContainer;

const getRefs = () => {
  const refs = {};
  if (!scrollContainer) {
    return;
  }

  scrollWatchers.forEach(watcher => {
    // left and right props assume no horizontal scrolling
    const { watchItem, callbacks, container, recalculateLocation, offsets, ...watcherProps} = watcher;
    refs[watchItem.dataset.ref] = {
      ...watcherProps,
      domNode: watchItem
    };
  });

  return refs;
};

let wrapperKey = 0;
class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.key = wrapperKey++;
    this.ref = {};
    this.onUpdateRefs = this.onUpdateRefs.bind(this);
    this.onUpdateProps = this.onUpdateProps.bind(this);

    const vars = values(props.__vars__);
    const exps = values(props.__expr__);

    this.usesRefs = exps.some(v => v.includes('refs.'));

    // listen for props updates IF we care about them
    if (vars.length || exps.length) {
      // called with new doc state
      // when any component calls updateProps()
      updatePropsCallbacks.push(this.onUpdateProps);
    }

    // listen for ref updates IF we care about them
    if (props.hasHook || this.usesRefs) {
      updateRefsCallbacks.push(this.onUpdateRefs);
    }

    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error: error });
  }

  onUpdateProps(newState, changedKeys) {
    const { __vars__, __expr__ } = this.props;

    // were there changes to any vars we track?
    // or vars our expressions reference?
    const shouldUpdate = changedKeys.some(k => {
      return (
        values(__vars__).includes(k) ||
        values(__expr__).some(expr => expr.includes(k))
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
      nextState[key] = evalExpression(newState, __expr__[key], key, evalContext);
    });
    // trigger a re-render of this component
    // and more importantly, its wrapped component
    this.setState(nextState);
  }

  onUpdateRefs(newState) {
    const { __expr__ } = this.props;

    if (this.usesRefs) {
      const nextState = {refs: newState.refs};
      entries(__expr__)
        .forEach(([key, val]) => {
          if (!key.includes('refs.')) {
            return;
          }
          nextState[key] = evalExpression(newState, val, key, evalContext);
        });

      // trigger a render with latest state
      this.setState(nextState);
    }
  }

  componentWillUnmount() {
    const propsIndex = updatePropsCallbacks.indexOf(this.onUpdateProps);
    if (propsIndex > -1) updatePropsCallbacks.splice(propsIndex, 1);

    const refsIndex = updateRefsCallbacks.indexOf(this.onUpdateRefs);
    if (refsIndex > -1) updateRefsCallbacks.splice(refsIndex, 1);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ border: 'solid red 1px', padding: 10}}>
          {this.state.error.message}
        </div>
      );
    }

    const { __expr__, __vars__, hasError, ...state } = this.state
    const { children, ...passThruProps } = this.props
    return React.Children.map(children, (c, i) => {
      return React.cloneElement(c, {
        key: `${this.key}-${i}`,
        ...state,
        ...passThruProps,
      })
    })
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

    this.scrollListener = this.scrollListener.bind(this);
    this.initScrollListener = this.initScrollListener.bind(this);

    const ast = filterASTForDocument(props.ast);

    const {
      vars,
      derived,
      data,
      elements,
    } = splitAST(ast);



    const initialState = {
      ...getVars(vars),
      ...getData(data, props.datasets),
    };
    const derivedVars = this.derivedVars = getVars(derived, initialState);

    let state = this.state = {
      ...initialState,
      ...getDerivedValues(derivedVars),
    };

    this.updateState = (newState) => {
      // merge new doc state with old
      const newMergedState = {...this.state, ...newState};
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
      // Update doc state reference.
      // We re-use the same object here so that
      // IdyllDocument.state can be accurately checked in tests
      state = Object.assign(state, nextState);
      // pass the new doc state to all listeners aka component wrappers
      updatePropsCallbacks.forEach(f => f(state, changedKeys));
    };

    evalContext.update = this.updateState;


    const rjs = new ReactJsonSchema({...props.components, Wrapper});
    const schema = translate(ast);

    const wrapTargets = findWrapTargets(schema, this.state);

    let refCounter = 0;

    const transformedSchema = mapTree(
      schema,
      node => {
        if (typeof node === 'string') return node;

        // transform refs from strings to functions and store them
        if (node.ref || node.hasHook) {
          node.refName = node.ref || node.component + (refCounter++).toString();
          node.ref = el => {
            if (!el) return;
            const domNode = ReactDOM.findDOMNode(el);
            domNode.dataset.ref = node.refName;
            scrollOffsets[node.refName] = node.scrollOffset || 0;
            refCache[node.refName] = {
              props: node,
              domNode: domNode
            };
          };
        }

        if (!wrapTargets.includes(node)) return node;

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
            if (hooks.indexOf(k) > -1) {
              return;
            }
            node[k] = evalExpression(state, __expr__[k], k, evalContext);
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
          this.updateState(newState);
        };

        return {
          component: Wrapper,
          __vars__,
          __expr__,
          hasHook: node.hasHook,
          refName: node.refName,
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

  scrollListener() {
    const refs = getRefs();
    updateRefsCallbacks.forEach(f => f({ ...this.state, refs }));
  }

  initScrollListener(el) {
    if (!el) return;

    let scroller = scrollparent(el);
    if (scroller === document.documentElement) {
      scroller = document.body;
    }
    scrollContainer = scrollMonitor.createContainer(scroller);
    Object.keys(refCache).forEach((key) => {
      const { props, domNode } = refCache[key];
      const watcher = scrollContainer.create(domNode, scrollOffsets[key]);
      hooks.forEach((hook) => {
        if (props[hook]) {
          watcher[scrollMonitorEvents[hook]](() => {
            evalExpression(this.state, props[hook], hook, evalContext)();
          });
        }
      })
      scrollWatchers.push(watcher);
    });
    if (scroller === document.body) {
      scroller = window;
    }
    scroller.addEventListener('scroll', this.scrollListener);
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
    updateRefsCallbacks.forEach(f => f({ ...this.state, refs }));
  }

  render() {
    return this.kids;
  }
}

export default IdyllDocument;
