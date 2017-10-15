import React from 'react';
const ReactDOM = require('react-dom');

class Container extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      expandLeft: 0,
      expandRight: 0
    };

    this.setPosition = this.setPosition.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setPosition);
    try {
      this.node = ReactDOM.findDOMNode(this)
      this.setPosition();
    } catch(e) {}
  }

  //shouldComponentUpdate (nextProps, nextState) {
    //return Math.round(nextState.expandLeft) !== Math.round(this.state.expandLeft) ||
           //Math.round(nextState.expandRight) !== Math.round(this.state.expandRight);
  //}

  setPosition () {
    var expandLeft, expandRight;
    var rect = this.node.getBoundingClientRect();
    var pageWidth = window.innerWidth;

    if (this.props.fullBleed) {
      expandLeft = Infinity;
      expandRight = Infinity;
    } else {
      expandLeft = this.props.expandLeft === undefined ? this.props.expand : this.props.expandLeft;
      expandRight = this.props.expandRight === undefined ? this.props.expand : this.props.expandRight;
    }

    var left = Math.max(rect.left - expandLeft, this.props.padding);
    var right = Math.min(rect.right + expandRight, pageWidth - this.props.padding);

    this.setState({
      expandLeft: left - rect.left,
      expandRight: rect.right - right
    });
  }

  render () {
    var expandStyle = Object.assign({}, this.props.style || {}, {
      marginLeft: this.state.expandLeft,
      marginRight: this.state.expandRight
    });

    return <div
      style={this.props.style}
      className={this.props.className}
    >
      <div style={expandStyle}>
        {this.props.children}
      </div>
    </div>
  }
}

Container.defaultProps = {
  padding: 15,
  expand: 0,
  fullBleed: false
}

export default Container;
