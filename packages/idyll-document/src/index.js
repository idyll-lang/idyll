const React = require('react');
const walkVars = require('./visitors/vars');
const walkNode = require('./visitors/node');
const utils = require('./utils');

const transformRefs = (refs) => {
  const output = {};
  const keys = ['scrollProgress', 'size', 'position'];
  Object.keys(refs).forEach((ref) => {
    const val = refs[ref];
    keys.forEach((key) => {
      if (val === null || val === undefined) {
        return;
      }
      const results = utils.flattenObject(key, val[key]);
      Object.keys(results).forEach((result) => {
        output['_idyllRefs' + ref + result] = results[result];
      });
    });
  });
  return output;
};

class InteractiveDocument extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleUpdateProps = this.handleUpdateProps.bind(this);

    // Walk the tree, creating the proper components for evererything.
    this.bindings = {};
    this._idyllRefs = {};
    this.derivedVars = {};
    this.initialState = {};
    this.updateFuncCache = {};

    props.ast.map(walkVars(this, props.datasets));

    this.state = this.initialState;
    
    const nodeWalker = walkNode(this, props.componentClasses);
    this.getChildren = () => {
      return props.ast.map(nodeWalker());
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

  setStateAndDerived(newState) {
    Object.keys(this.derivedVars).forEach((dv) => {
      this.derivedVars[dv].update(newState);
    });
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
    return React.createElement('div', {className: 'idyll-root'}, this.getChildren());
  }
}

module.exports = InteractiveDocument;
