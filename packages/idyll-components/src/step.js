import React from 'react';

let idx = 0;
class Step extends React.Component {
  componentDidMount() {
    let _idx =
      this.props.stepIndex === undefined ? idx++ : this.props.stepIndex;
    this.props.registerStep &&
      this.props.registerStep(
        _idx,
        this.props.state,
        (this.props.onEnter || (() => {})).bind(this)
      );
  }
  render() {
    const {
      idyll,
      updateProps,
      hasError,
      registerStep,
      onEnter,
      state,
      className,
      stepIndex,
      ...props
    } = this.props;
    return (
      <div
        ref={ref => (this.ref = ref)}
        className={`idyll-step ${className || ''}`}
        {...props}
      />
    );
  }
}

Step._idyll = {
  name: 'Step',
  tagType: 'open'
};

export default Step;
