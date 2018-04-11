import React from 'react';
import { filterChildren, mapChildren } from 'idyll-component-children';
import { getProperty } from 'idyll-ast';

const Step = require('./step');

class Stepper extends React.PureComponent {

  render() {
    return (
      <div className="idyll-stepper" style={{position: 'relative'}}>
        {this.props.currentState ?
          filterChildren(
            children,
            (c) => {
              return c.props.state === this.props.currentState
            }
          )
          : filterChildren(
              children,
              (c) => {
                return c.type.name && c.type.name.toLowerCase() === 'step';
            }
          )[this.props.currentStep]}
      </div>
    );
  }
}


Stepper.registerStep = (elt, name, val) => {
  SCROLL_STEP_MAP[elt] = val;
  SCROLL_NAME_MAP[elt] = name;
}

Stepper.defaultProps = {
  currentSlide: 1
};

Stepper._idyll = {
  name: "Stepper",
  tagType: "open",
  children: [`
[Step]This is the content for step 1[/Step]
[Step]This is the content for step 2[/Step]
[Step]This is the content for step 3[/Step]`],
  props: [{
    name: "currentStep",
    type: "number",
    example: '0'
  }]
}
export default Slideshow;
