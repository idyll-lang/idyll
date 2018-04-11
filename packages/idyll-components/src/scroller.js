const React = require('react');
const { filterChildren, mapChildren } = require('idyll-component-children');
const d3 = require('d3');

const SCROLL_STEP_MAP = {};
const SCROLL_NAME_MAP = {};

const styles = {
  SCROLL_GRAPHIC: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 'auto',
    height: '100vh',
    width: '100%',
    transform: `translate3d(0, 0, 0)`,
    zIndex: -1
  },
  SCROLL_GRAPHIC_FIXED: {
    position: 'fixed'
  },
  SCROLL_GRAPHIC_BOTTOM: {
    bottom: 0,
    top: 'auto'
  },

  SCROLL_GRAPHIC_INNER: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)'
  }
}

let id = 0;

class Scroller extends React.Component {
  constructor(props) {
    super(props);
    this.id = id++;
    this.state = {
      isFixed: false,
      isBottom: false,
      graphicHeight: 0,
      graphicWidth: 0
    };
  }


  componentDidMount() {
    require('intersection-observer');
    const scrollama = require('scrollama');
    // instantiate the scrollama
    const scroller = scrollama();
    this.handleResize();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: '.idyll-scroll-text .idyll-scroll-step', // required
        container: `#idyll-scroll-${this.id}`, // required (for sticky)
        graphic: '.idyll-scroll-graphic' // required (for sticky)
      })
      .onStepEnter(this.handleStepEnter.bind(this))
      // .onStepExit(handleStepExit)
      .onContainerEnter(this.handleContainerEnter.bind(this))
      .onContainerExit(this.handleContainerExit.bind(this));


    // setup resize event
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleStepEnter({ element, index, direction }) {
    SCROLL_STEP_MAP[index] && SCROLL_STEP_MAP[index]();
    let update = { currentStep: index };
    if (SCROLL_NAME_MAP[index]) {
      update.currentState = SCROLL_NAME_MAP[index];
    }
    this.props.updateProps && this.props.updateProps(update);
    if (index === Object.keys(SCROLL_STEP_MAP).length - 1) {
      d3.select('body').style('overflow', 'auto');
    }
  }

  handleResize() {
    this.setState({
      graphicHeight: window.innerHeight + 'px',
      graphicWidth: window.innerWidth + 'px',
    });
  }
  handleContainerEnter(response) {
    if (this.props.disableScroll && (!this.props.currentStep || this.props.currentStep < Object.keys(SCROLL_STEP_MAP).length - 1)) {
      d3.select('body').style('overflow', 'hidden');
    }
    this.setState({ isFixed: true, isBottom: false });
  }

  handleContainerExit(response) {
    this.setState({ isFixed: false, isBottom: response.direction === 'down'});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-scroll-step`)
        .filter(function (d, i) { return i === nextProps.currentStep;})
        .node()
        .scrollIntoView({ behavior: 'smooth' });
    }
    if (this.props.currentState !== nextProps.currentState) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-scroll-step`)
        .filter(function (d, i) { return nextProps.currentState === SCROLL_NAME_MAP[i] })
        .node()
        .scrollIntoView({ behavior: 'smooth' });
    }
    if (nextProps.disableScroll && (!nextProps.currentStep || nextProps.currentStep < Object.keys(SCROLL_STEP_MAP).length - 1)) {
      d3.select('body').style('overflow', 'hidden');
    }
  }

  render() {
    const { hasError, updateProps, children, ...props } = this.props;
    const { isFixed, isBottom, graphicHeight, graphicWidth } = this.state;
    return (
      <div ref={(ref) => this.ref = ref} id={`idyll-scroll-${this.id}`} style={{position: 'relative'}}>
        <div className="idyll-scroll-graphic"
          style={Object.assign({ height: graphicHeight },
            styles.SCROLL_GRAPHIC,
            isFixed ? styles.SCROLL_GRAPHIC_FIXED : {},
            isBottom ? styles.SCROLL_GRAPHIC_BOTTOM : {})} >

          <div style={Object.assign({ width: graphicWidth }, styles.SCROLL_GRAPHIC_INNER)}>
            {filterChildren(
              children,
              (c) => {
                return c.type.name && c.type.name.toLowerCase() === 'scrollgraphic';
              }
            )}
          </div>
        </div>
        <div className="idyll-scroll-text">
          {filterChildren(
              children,
              (c) => {
                return !c.type.name || c.type.name.toLowerCase() !== 'scrollgraphic';
              }
            )}
        </div>
      </div>
    );
  }
}


Scroller.registerStep = (elt, name, val) => {
  SCROLL_STEP_MAP[elt] = val;
  SCROLL_NAME_MAP[elt] = name;
}
module.exports = Scroller;
