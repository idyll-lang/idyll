const React = require('react');

let idx = 0;
class Step extends React.Component {

  componentDidMount() {
    this.props.registerStep(idx++, this.props.state, (this.props.onEnter || (() => {})).bind(this));
  }
  render() {
    const { idyll, updateProps, hasError, registerStep, onEnter, state, className, ...props } = this.props;
    return (
      <div ref={(ref) => this.ref = ref} className={`idyll-step ${className || ''}`} {...props} />
    );
  }
}

module.exports = Step;
