![idyll](https://cloud.githubusercontent.com/assets/1074773/22858218/705cefae-f06b-11e6-922e-642c4ed7851e.png)

Command line interface for idyll lang

## What is Idyll?

See https://idyll-lang.github.io/idyll/

## Examples

* The project introduction https://idyll-lang.github.io/idyll/
* A scrolly example https://idyll-lang.github.io/idyll/scroll/

## Installation

```
npm install -g idyll
```

## Usage

```
idyll input.idl --css input.css
```

## Walkthrough

Install the [project generator](https://github.com/idyll-lang/generator-idyll) and create a new Idyll project:

```
$ npm install -g yo generator-idyll
$ yo idyll
```

`cd` into the project folder and open `index.idl`.

The simplest thing that you can put in this file is just 
text, so try that. Inside of index.idl, write

```
hello world!
```

and run it with:

```
npm start
```

This should open your web browser to a page declaring its greetings to the world. 

### CSS 

You'll probably want to style your page, so open `styles.css` and 
edit the styles.

The page should automatically reload.

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

A simple custom component already exists inside of the `components` folder.
This component can be invoked in your .idl file like:

```
[var name:"test" value:0 /]

Hello world.

[Range value:test min:0 max:10 /]

[CustomComponent value:test /]
```

To update a variable from within a component, you can call `this.updateProps({ propname: val })` and idyll will automatically propegate the changes to that property back to any variables that were bound to it, e.g. in 
`custom-component.js` adding `this.updateProps({value: newValue})` would update the value of the variable `test` and
subsequently change the position of the range slider.

