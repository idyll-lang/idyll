const React = require('react');

class StepperControl extends React.Component {

  componentDidMount() {
  }
  render() {
    const { idyll, ...props } = this.props;
    return <div className="idyll-stepper-control">
      <div className='idyll-stepper-control-button idyll-stepper-control-button-previous'  onClick={this.props.previous}>
      ←
      </div>
      <div className='idyll-stepper-control-button idyll-stepper-control-button-next' onClick={this.props.next}>
      →
      </div>
    </div>;


    // (
    //   <div ref={(ref) => this.ref = ref} className={`idyll-step ${className || ''}`}  style={{margin: '10vh 0 60vh 0'}} {...props} />
    // );
  }
}

module.exports = StepperControl;
