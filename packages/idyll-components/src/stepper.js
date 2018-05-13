import React from 'react';
import { getProperty } from 'idyll-ast';
const { filterChildren, mapChildren } = require('idyll-component-children');

const Step = require('./step');

class Stepper extends React.PureComponent {

  constructor(props) {
    super(props);
    this.SCROLL_STEP_MAP = {};
    this.SCROLL_NAME_MAP = {};
  }


  registerStep(elt, name, val)  {
    this.SCROLL_STEP_MAP[elt] = val;
    this.SCROLL_NAME_MAP[elt] = name;
  }

  getSteps() {
    return filterChildren(
        this.props.children,
        (c) => {
          return c.type.name && c.type.name.toLowerCase() === 'step';
      }
    )
  }

  next() {
    this.props.updateProps({ currentStep: (this.props.currentStep + 1) % (this.getSteps().length) });
  }
  previous() {
    let newStep = this.props.currentStep - 1;
    if (newStep < 0) {
      newStep = (this.getSteps().length) + newStep;
    }

    this.props.updateProps({ currentStep: newStep });
  }

  getSelectedStep() {
    const { currentState, currentStep } = this.props;
    const steps = this.getSteps();
    if (currentState) {
      return filterChildren(
        steps,
        (c) => {
          return c.props.state === currentState
        }
      )[0];
    }
    return steps[currentStep % steps.length];
  }

  render() {
    const { children, height, ...props } = this.props;
    return (
      <div className="idyll-stepper" style={{position: 'relative', height: height}}>
        <div className="idyll-step-graphic">
          {filterChildren(
            children,
            (c) => {
              return c.type.name && c.type.name.toLowerCase() === 'graphic';
            }
          )}
        </div>
        <div className="idyll-step-content">
          {
            mapChildren(this.getSelectedStep(), (c) => {
              return React.cloneElement(c, {
                registerStep: this.registerStep.bind(this)
              })
            })
          }
        </div>
        {mapChildren(filterChildren(
          children,
          (c) => {
            return c.type.name && c.type.name.toLowerCase() === 'steppercontrol';
          }
        ), (c) => {
          return React.cloneElement(c, {
            next: this.next.bind(this),
            previous: this.previous.bind(this)
          })
        })}
      </div>
    );
  }
}


Stepper.defaultProps = {
  currentStep: 0,
  height: 500
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
export default Stepper;
