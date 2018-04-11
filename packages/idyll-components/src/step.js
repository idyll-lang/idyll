const React = require('react');
const { registerScrollStep } = require('./scroller');

let idx = 0;
class CustomComponent extends React.Component {

  componentDidMount() {
    registerScrollStep(idx++, this.props.state, (this.props.onEnter || (() => {})).bind(this));
  }
  render() {
    const { idyll, updateProps, hasError, onEnter, state, className, ...props } = this.props;
    return (
      <div ref={(ref) => this.ref = ref} className={`idyll-step ${className || ''}`}  style={{margin: '10vh 0 60vh 0'}} {...props} />
    );
  }
}

module.exports = CustomComponent;
