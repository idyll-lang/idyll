const React = require('react');
const { filterChildren, mapChildren } = require('idyll-component-children');
import TextContainer from './text-container';
const d3 = require('d3-selection');

const styles = {
  SCROLL_GRAPHIC: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    width: '100%',
    transform: `translate3d(0, 0, 0)`,
    zIndex: 0
  },

  SCROLL_GRAPHIC_INNER: {
    position: 'absolute',
    // right: '1rem',
    left: 0,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)'
  }
};

let id = 0;

class Scroller extends React.Component {
  constructor(props) {
    super(props);
    this.id = id++;
    this.state = {
      graphicHeight: 0,
      graphicWidth: 0
    };

    this.SCROLL_STEP_MAP = {};
    this.SCROLL_NAME_MAP = {};
  }

  componentDidMount() {
    require('intersection-observer');
    const scrollama = require('./scrollama');
    // instantiate the scrollama
    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: `#idyll-scroll-${this.id} .idyll-step`, // required
        progress: this.props.progress !== undefined ? true : false,
        debug: this.props.debug,
        offset: this.props.offset
      })
      .onStepEnter(this.handleStepEnter.bind(this))
      .onStepProgress(this.handleStepProgress.bind(this));

    // setup resize event

    this.scroller = scroller;

    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleStepEnter({ element, index, direction }) {
    this.SCROLL_STEP_MAP[index] && this.SCROLL_STEP_MAP[index]();
    let update = { currentStep: index };
    if (this.SCROLL_NAME_MAP[index]) {
      update.currentState = this.SCROLL_NAME_MAP[index];
    }
    this.props.updateProps && this.props.updateProps(update);
    if (index === Object.keys(this.SCROLL_STEP_MAP).length - 1) {
      d3.select('body').style('overflow', 'auto');
    }
  }

  handleResize() {
    this.setState({
      graphicHeight: window.innerHeight + 'px',
      graphicWidth: window.innerWidth + 'px'
    });
    // this.scroller.resize();
  }

  handleStepProgress(response) {
    const { progress } = response;
    const update = { progress };
    this.props.updateProps && this.props.updateProps(update);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.disableScroll &&
      this.props.currentStep !== prevProps.currentStep
    ) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-step`)
        .filter(function(d, i) {
          return i === this.props.currentStep;
        })
        .node()
        .scrollIntoView({ behavior: 'smooth' });
    }
    if (
      this.props.disableScroll &&
      this.props.currentState !== prevProps.currentState
    ) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-step`)
        .filter((d, i) => this.props.currentState === this.SCROLL_NAME_MAP[i])
        .node()
        .scrollIntoView({ behavior: 'smooth' });
    }
    if (
      this.props.disableScroll &&
      (!this.props.currentStep ||
        this.props.currentStep < Object.keys(this.SCROLL_STEP_MAP).length - 1)
    ) {
      d3.select('body').style('overflow', 'hidden');
    }
  }

  registerStep(elt, name, val) {
    this.SCROLL_STEP_MAP[elt] = val;
    this.SCROLL_NAME_MAP[elt] = name;
  }

  render() {
    const { hasError, updateProps, idyll, children, ...props } = this.props;
    const { graphicHeight, graphicWidth } = this.state;

    const graphicChildren = filterChildren(children, c => {
      return c.type.name && c.type.name.toLowerCase() === 'graphic';
    });

    const StepContainer = props.fullWidthSteps ? 'div' : TextContainer;
    let stepIndex = 0;

    return (
      <div
        ref={ref => (this.ref = ref)}
        className="idyll-scroll"
        id={`idyll-scroll-${this.id}`}
        style={Object.assign({ position: 'relative' })}
      >
        {graphicChildren && graphicChildren.length ? (
          <div
            className="idyll-scroll-graphic"
            style={Object.assign({}, styles.SCROLL_GRAPHIC, {
              height: graphicHeight,
              zIndex: idyll && idyll.authorView ? 0 : -1
            })}
          >
            <div
              style={Object.assign(
                { width: graphicWidth },
                styles.SCROLL_GRAPHIC_INNER
              )}
            >
              {graphicChildren}
            </div>
          </div>
        ) : null}
        <StepContainer idyll={idyll}>
          <div className="idyll-scroll-text">
            {mapChildren(
              filterChildren(children, c => {
                return !c.type.name || c.type.name.toLowerCase() === 'step';
              }),
              c => {
                return React.cloneElement(c, {
                  registerStep: this.registerStep.bind(this),
                  stepIndex: stepIndex++
                });
              }
            )}
          </div>
        </StepContainer>
      </div>
    );
  }
}

Scroller._idyll = {
  name: 'Scroller',
  tagType: 'open',
  children: [
    `
  [Graphic fullWidth:true]
    [VegaLite
      data:\`[{x: 0, y: 0}, {x: 1, y: 1}]\`
      spec:\`{
      mark: "line",
      encoding: {
        x: {
          field: "x",
          type: "quantitative"
        },
        y: {
          field: "y",
          type: "quantitative"
        }
      }
    }\`
    width:"container"
    height:300 /]
  [/Graphic]
  [Step]This is the content for step 1[/Step]
  [Step]This is the content for step 2[/Step]
  [Step]This is the content for step 3[/Step]`
  ],
  props: [
    {
      name: 'currentStep',
      type: 'variable',
      example: 'x',
      description: 'The index of the currently selected step.'
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      example: 'true',
      description: 'Is this component fullWidth.'
    },
    {
      name: 'currentState',
      type: 'object',
      description:
        'The state value associated with the currently selected step. Note you must set the state property on the step components for this value to update.'
    },
    {
      name: 'progress',
      type: 'number',
      description:
        'The percent of completion (0-1) of the currently selected step'
    },
    {
      name: 'offset',
      type: 'number',
      description:
        '(number 0 - 1, or string with "px"): How far from the top of the viewport to trigger a step. (default: 0.5) (middle of screen)'
    },
    {
      name: 'debug',
      type: 'boolean',
      description: 'Show scroller debug information.'
    }
  ]
};

export default Scroller;
