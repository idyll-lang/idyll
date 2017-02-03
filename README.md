# idyll
Command line interface for idyll lang

## Installation

```
npm install -g idyll
```

## Usage

```
idyll input.idl --css input.css
```

## Walkthrough

Create a folder for your idyll project:

```
$ mkdir my-idyll-proj
$ cd my-idyll-proj
```

Start by creating a source file. This is where you are going 
to create your document:

```
touch index.idl
```

The simplest thing that you can put in this file is just 
text, so try that. Inside of index.idl, write

```
hello world!
```

and run it with:

```
idyll index.idl
```

This should open your web browser to a page declaring its greetings to the world. 

### CSS 

You'll probably want to style your page, so create a file called `app.css` and 
throw some CSS in it. For example, 

```css
body, html {
 margin: 0;
 padding: 0; 
}

.article {
  margin: 0 auto;
  width: 400px;
}
```

Then run with 

```
idyll index.idl --css app.css
```

### Components

You probably want more than just text! Try using one of the built-in components. Inside of 
your `.idl` file write:


```
[var name:"test" value:0 /]

Hello world.

[Range value:test min:0 max:10 /]
```

To see the rest of the available component, for now see https://github.com/idyll-lang/idyll/tree/master/components

### Custom Components

To create a custom component do the following:

```
$ npm install --save idyll-component
$ mkdir components
$ touch custom-component.js
```

Then inside of `custom-component.js`:

```jsx
const IdyllComponent = require('idyll-component');

class CustomComponent extends IdyllComponent {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        My custom component. Input value: {this.props.value}
      </div>
    )
  }
}

CustomComponent.defaultProps = {
  value: 0
};

module.exports = CustomComponent;

```

this can then be invoked in your .idl file like:

```
[var name:"test" value:0 /]

Hello world.

[Range value:test min:0 max:10 /]

[CustomComponent value:test /]
```

To update a variable from within a component, you can call `this.updateProps({ propname: val })` and idyll will automatically propegate the changes to that property back to any variables that were bound to it, e.g. in 
`custom-component.js` adding `this.updateProps({value: newValue})` would update the value of the variable `test` and
subsequently change the position of the range slider.


To change the location of your custom components use:

```
idyll index.idl --css app.css --components ./component-folder/
```


