import React from 'react';
import ReactDOM from 'react-dom'

const stateClasses = [
  'is-top',
  'is-fixed',
  'is-bottom'
];

class Content extends React.PureComponent {
  render () {
    return <div style={this.props.style}>
      {this.props.children}
    </div>
  }
}

class Feature extends React.PureComponent {
  constructor (props) {
    super(props)
    this.setFeature = this.setFeature.bind(this);
    this.setRoot = this.setRoot.bind(this);

    this.state = {
      scrollState: 0,
      featureMarginLeft: 0,
      featureWidth: typeof window !== 'undefined' ? window.innerWidth : 0
    };
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
    const node = ReactDOM.findDOMNode(this);
  }

  setRoot (c) {
    this.rootEl = window.rootEl = c;
    this.initialize();
  }

  setFeature (c) {
    this.featureEl = window.featureEl = c;
    this.initialize();
  }

  handleResize () {
    let rootRect = this.rootEl.getBoundingClientRect()
    this.setState({
      featureMarginLeft: -rootRect.left,
      featureWidth: window.innerWidth,
      featureHeight: window.innerHeight
    });
  }

  handleScroll () {
    if (!this.rootEl) return;
    let rootRect = this.rootEl.getBoundingClientRect();
    let position = rootRect.top / (window.innerHeight - rootRect.height)
    // Update this whenever it changes so that the state is correctly adjusted:
    this.setState({scrollState: position < 0 ? 0 : (position <= 1 ? 1 : 2)})
    // Only update the value when onscreen:
    if (rootRect.top < window.innerHeight && rootRect.bottom > 0) {
      this.props.updateProps({value: position})
    }
  }



  initialize () {
    console.log('initialize');
    console.log('children', this.props.children);
    if (!this.rootEl || !this.featureEl) return;

    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  unwrapChildren() {
    return this.props.children.map((c) => {
      if (c => c.type.name && c.type.name.toLowerCase() === 'wrapper') {
        return c.props.children[0];
      }
      return c;
    })
  }

  getFeatureChild() {
    const c = this.unwrapChildren().filter(c => {
      if (!c.type) {
        return false;
      }
      return (c.type.name && c.type.name.toLowerCase() === 'content') || c.type.prototype instanceof Content;
    })
    console.log('featued c', c);
    if (c.length) {
      return c[0];
    }
  }

  getNonFeatureChildren() {
    return this.unwrapChildren().filter(c => {
      if (!c.type) {
        return true;
      }
      return (!c.type.name || c.type.name.toLowerCase() !== 'content') && !(c.type.prototype instanceof Content);
    });
  }

  render () {
    let feature;
    let ps = this.state.scrollState;
    let featureStyles = {
      width: this.state.featureWidth + 'px',
      height: this.state.featureHeight + 'px',
      marginLeft: ps === 1 ? 0 : (this.state.featureMarginLeft + 'px'),
      position: ps >= 1 ? 'fixed' : 'absolute',
      bottom: ps === 2 ? 0 : 'auto',
      zIndex: -1
    };

    if (ps === 1) {
      featureStyles.top = 0;
      featureStyles.right = 0;
      featureStyles.bottom = 0;
      featureStyles.left = 0;
    }

    let rootStyles = {
      position: 'relative',
      marginLeft: 0,
      marginRight: 0,
      maxWidth: 'none'
    };

    var featureChild = this.getFeatureChild();
    var nonFeatureChildren = this.getNonFeatureChildren();

    console.log('feature child', featureChild);
    console.log('rendering feature', this.state.scrollState);
    if (featureChild) {
      feature = React.cloneElement(featureChild, {
        style: featureStyles,
        ref: (ref) => this.setFeature(ref)
      });
    }

    return <figure
      style={rootStyles}
      className={`idyll-feature ${stateClasses[this.state.scrollState]}`}
      ref={(ref) => { return this.setRoot(ref) }}
    >
      {feature}
      {nonFeatureChildren}
    </figure>
  }
}


export { Content, Feature as default };
