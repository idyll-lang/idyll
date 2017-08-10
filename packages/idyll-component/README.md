# idyll-component
Extensible component to be used in idyll projects

## Installation

```
npm install --save idyll-component
```


## Usage

```jsx
const React = require('react');
const IDLComponent = require('../idl-component');

class CustomComponent extends IDLComponent {
  constructor(props) {
    super(props);
  }

  handleClick() {
    ...
    this.updateProps({
      prop1: newProp1
    });
  }

  render() {

    return (
      <div prop1={this.props.prop1} >
        {...}
      </div>
    )
  }
}

CustomComponent.defaultProps = {
  ...
}

module.exports = CustomComponent;
```
