![idyll-text](https://cloud.githubusercontent.com/assets/1074773/24593896/95730fba-17dc-11e7-82dd-ae7335f205b6.png)

Command line interface for idyll lang. 

*See https://idyll-lang.github.io/ for full documentation*.

*Join our chatroom on Gitter: https://gitter.im/idyll-lang/Lobby*

# What is Idyll?

Idyll is a tool that makes it easier to author interactive narratives 
for the web. The goal of the project is to provide a friendly
markup language — and an associated toolchain —
that can be used to create dynamic, text-driven web pages. 
 
Idyll lowers the barrier to entry for
individuals to create documents that use common narrative techniques
such as embedding interactive charts and graphs,
responding to scroll events, and [explorable explanations](http://explorableexplanations.com/). Additionally,
its readable format facilitates
collaboration between writers, editors, designers,
and programmers on complex projects.

Check out some articles create with Idyll:

* The Etymology of Trig Functions - https://mathisonian.github.io/trig/etymology/
* Seattle PD’s Dashcam Problem - https://mathisonian.github.io/dashcam/
* United Complaints of America - https://mathisonian.github.io/consumer-complaints/
* A Scrolling Introduction to Idyll - <a href="https://idyll-lang.github.io/idyll/scroll/" target="_blank">https://idyll-lang.github.io/idyll/scroll/<a/>

```md
# Idyll

This is *Idyll* markup. By default, everything is text,
using some common markdown syntax.

But you can include custom JavaScript components inline:

[DynamicComponent property:"value" /]
```

The project is inspired by markdown, and
supports a subset of commonly used markdown
syntax, for example using a `#` pound sign
to denote headers, using three backticks to
display code, and using stars to display inline **bold** and *italics*.

It is built on top of React, taking advantage of the one-way data 
binding pattern to make it easy to create custom JavaScript components
that act as first class elements in the markup. Idyll makes it 
easy to create data-driven articles

```
[data name:"cooldataset"  src:"cooldata.json" /]

Check out this chart:

[Chart data:cooldataset type:"line" /]
```

![chart](https://idyll-lang.github.io/images/chart.png)

and handles variable binding for you.

```
[var name:"myVar" value:10 /]

[Range value:myVar min:0 max:100 /]
[DisplayVar var:myVar /]
```

![displayvar](https://idyll-lang.github.io/images/displayvar.gif)


# Getting Started

The easiest way to get started with Idyll is to use the project generator.
It will help get you set up using custom components, datasets, and stylesheets. 
To use the generator:

```sh
$ npm install -g yo generator-idyll
$ yo idyll
$ cd idyll-project
```

The generator will produce a structure that looks like this:

```sh
$  tree -I node_modules
.
├── _index.html
├── components
│   └── custom-component.js
├── data
│   └── example-data.json
├── images
│   └── idyll.png
├── index.idl
├── package.json
└── styles.css

3 directories, 7 files
```

The files do the following:

* `index.idl` - The main Idyll file, write your text in here.
* `styles.css` - By putting CSS in here you can override the default styles.
* `components/` - The folder for custom components. Any component defined in this folder can be invoked in the .idl file.
* `data/` - If you want to include a dataset in your project, put it in here.
* `https://idyll-lang.github.io/images/` - A folder for static images.
* `_index.html` - A barebones HTML file that will be used if you publish your project to the web.
* `package.json` - This file contains all the metadata for your project.

To get started, from a terminal in that directory run `npm start` and Idyll will compile your 
file and open it in your web browser. Every time you save the `index.idl` file, the system will automatically recompile 
everything and update the page in the browser.

If you instead just want to test things out quickly, the simplest way is to
install it from npm, create a new file and start writing:

```sh
$ npm install -g idyll
$ idyll my-file.idl
```

The `idyll` command will automatically compile everything and load the
interactive page in your web browser.

To use a custom stylesheet, use the `--css` flag.

```sh
$ idyll my-file.idl --css styles.css
```


# Configuration and Styles

## Command Line Options

The `idyll` command line tool accepts the following options

* `--css` the path to your CSS file. You can use this to override Idyll's default styles, e.g. `$ idyll index.idl --css my-custom-styles.css`.
* `--components` the path to your custom components. By default this points to `components/`.
* `--datasets` the path to the folder containing your datasets. By default this points to `data/`.
* `--layout` the name of the layout to use. By default this is `blog`. More on layouts below.
* `--theme` the name of the theme to use. By default this is `idyll`. More on themes below.
* `--build` the build flag tells Idyll to output the compiled JavaScript instead of running a server and opening your page in a web browser, `$ idyll index.idl --build > output.js`.

If you are using Idyll via the project generator, open `package.json` to change these options.

## Themes and Page Layout

Idyll exposes two options to help you style your project, `layout` and `theme`. `layout` deals with CSS styles related to how your content is
layed out on the page: width, columns, etc. The `theme` option allows you to choose diffent stylesheets to change the style of the content itself (text color, font, and so on).

### Layout

Idyll currently ships with two different page layouts that can be used to modify the structure of how to content is displayed on the page, allowing you to quickly test out different narrative styles
for you project.

#### Blog

This is the default layout. The `blog` layout is fairly traditional article layout with room in the margin to
put notes and other callouts.

![blog](https://idyll-lang.github.io/images/blog.gif)

#### Scroll

The scroll layout leaves more space for a fixed element, and adds margins between text sections,
making it easy to trigger events when a certain section enters the viewport.

![scroll](https://idyll-lang.github.io/images/scroll.gif)

See https://github.com/idyll-lang/idyll/blob/master/examples/scroll/index.idl for example usage of the scroll layout.

### Themes

There currently is only one default theme, expect more soon.


# Components 

## Syntax 

Besides text, components are the other basic building block of an Idyll document. 
Components are denoted with brackets, and can be invoked in one of two ways: they can be self
closing,

```
[Range min:0 max:10 value:value /]
```

or have a closing and opening tag with content in between.

```
[Button]
Click Me
[/Button]
```

## Component Properties

Properties can be passed into components
in the following ways:

### Number, String

Numbers or string literals may be used.

```
[Component propName:10 /]
[Component propName:"propValue" /]
```

### Variable or Dataset

A variable or dataset can be passed in directly, this will
automatically create a binding between that variable and property,
more on this in the next section.

```
[Component propName:myVar /]
```

### Expression

Use backticks to pass an evaluated expression:

```
[Component propName:`2 * 2 * 2` /]
[Component propName:`{ an: "object" }` /]
```

If the property expects a function,
the expression will automatically be
converted to a callback. This is convenient
for updating variables on events, for example.

```
[Component onClick:`myVar++` /]
```

Idyll uses naming conventions to determine if the expression should be converted to a callback.
Properties that are named `onXxxxx` (e.g. `onClick`) or `handleYyyyy` (e.g. `handleMouseMove`) are 
assumed to expect callbacks.


## Component Resolution

Components are resolved according to following algorithm:

* If there is a custom component with this name, use it.
* If there is a built-in component with this name, use it.
* If there is a valid HTML tag with this name, use it.
* If none of the above, just use a div, but give it the class of the component name

So, for example, assume we have one custom component, named `Custom`.

```
// Renders our custom component
[Custom /]

// Renders the built-in range component
[Range /]

// Renders `<img />` because it is a valid  HTML tag
[Img /]

// Renders `<div class="SomethingElse"></div>`
[SomethingElse /]
```



# Built-In Components

Idyll ships with a handful of components that
handle common tasks. They are broken into
three categories:

* [Layout](#layout) - these components help manage page layout, for example putting text in the `Aside` component will render it in the article margin instead of inline with the rest of your text.
  * [Aside](#aside)
  * [Fixed](#fixed)
  * [Inline](#inline)

* [Presentation](#presentation) - these components render something to the screen, for example the `Chart`
component takes data as input and can display several types of charts.
  * [Button](#button)
  * [Chart](#chart)
  * [DisplayVar](#displayvar)
  * [Header](#header)
  * [Link](#link)
  * [Range](#range)
  * [Slideshow / Slide](#slideshow-slide)
  * [SVG](#svg)
  * [Table](#table)
  * [VegaLite](#vegalite)

* [Helpers](#helpers) - these components don't affect the page content, but help with common tasks. The `Analytics` component makes it
easy to add Google Analytics to your page.
  * [Analytics](#analytics)
  * [Meta](#meta)

All built-in compononents expose a property `onEnteredView` that can be used to trigger events when a reader scrolls the page to 
reveal specific content.

## Layout

### Aside

Content inside of an aside component will be displayed in the margin of your document. For example, the [consumer complaints](https://mathisonian.github.io/consumer-complaints/) article uses the aside component to display a small chart and caption:

![aside](https://idyll-lang.github.io/images/aside.png)

```
[aside]
  [Chart type:"time" data:complaintsByDate /]
  [caption]Complaints sent to the CFPB each month[/caption]
[/aside]
```

### Fixed

Content inside of a `fixed` component will be locked in place, even when the rest of the document scrolls. The [scroll](https://idyll-lang.github.io/idyll/scroll) example uses the `fixed` component to keep the dynamic chart in place:

![fixed](https://idyll-lang.github.io/images/fixed.gif)

```
[fixed]
[Chart type:"scatter" data:dynamicData /]
[/fixed]
```

### Inline

The `inline` component adds the `display: inline-block` style property, so that items inside of `inline` component will
be displayed next to eachother. For example, this code,

```
[section]
[inline][img src:"..." /][/inline]
[inline][img src:"..." /][/inline]
[inline][img src:"..." /][/inline]
[/section]
```

Will display three images side by side.

## Presentation

### Button

This will display a button. To control what happens when the button is clicked, add an `onClick` property:

![button](https://idyll-lang.github.io/images/button.gif)

```
[button onClick`myVar += 1`]Click Me![/button]
```

### Chart

This will display a chart. It expects the following properties:

* `data` - A JSON object containing the data for this chart. It uses the [victory](https://formidable.com/open-source/victory/docs) library to handle rendering, so see those docs for more information on what types of data can be passed in.
* `type` - The type of the chart to display, can be `line`, `scatter`, `bar`, `pie`, or `time`. The time type is a line chart that expects the `x` values in the data to be in the temporal domain.

![chart](https://idyll-lang.github.io/images/chart.png)

```
[var name:`dataToBeCharted` value:`[
  {x: 0, y: 0.5},
  {x: 3.5, y: 0.5},
  {x: 4, y: 0},
  {x: 4.5, y: 1},
  {x: 5, y: 0.5},
  {x: 8, y: 0.5}
]` /]

[Chart type:"line" data:dataToBeCharted /]
```

### DisplayVar

This will render the value of a variable to the screen. It is mostly useful for debugging:

![displayvar](https://idyll-lang.github.io/images/displayvar.gif)

```
[var name:"myVar" value:10 /]

[Range value:myVar min:0 max:100 /]
[DisplayVar var:myVar /]
```

### Header

This component makes it easy to add a title, subtitle, and byline to your article:

![header](https://idyll-lang.github.io/images/header.png)

```
[Header
  title:"The Title of my Article"
  subtitle:"The subtitle of my article"
  author:"Matthew Conlen"
  authorLink:"https://github.com/mathisonian/"
  /]
```

### Link

This component just acts as syntactic sugar for displaying links inline in your text.

```
[link text:"the text" url:"https://some.url" /]

is equivalent to [a href:"https://some.url"]the text[/a].
```

### Range

This component displays a range slider. The properties are:

* `value`: The value to display; if this is a variable, the variable will automatically be updated when the slider is moved.
* `man`: The maximum value.
* `min`: The minimum value.
* `step`: The granularity of the slider

![displayvar](https://idyll-lang.github.io/images/displayvar.gif)

```
[var name:"myVar" value:10 /]

[Range value:myVar min:0 max:100 /]
[DisplayVar var:myVar /]
```


### Slideshow / Slide

This component is used to dynamically display different content. It can be used to make slideshows,
but is generally useful for dynamically displaying different content of any type.

![slides](https://idyll-lang.github.io/images/slides.gif)

```
[var name:"slide" value:1 /]

[slideshow currentSlide:slide]
  [slide]This is the content for slide 1[/slide]
  [slide]This is the content for slide 2[/slide]
  [slide]This is the content for slide 3[/slide]
[/slideshow]

[Button onClick:`slide = 1`]Slide 1[/Button]
[Button onClick:`slide = 2`]Slide 2[/Button]
[Button onClick:`slide = 3`]Slide 3[/Button]

```


### SVG

This component will display an SVG file inline using https://github.com/matthewwithanm/react-inlinesvg. This makes it
easy to style the SVG with css, as opposed to displaying the svg inside of an image tag.

Usage:

```
[SVG src="path/to/filg.svg" /]
```

### Table

Display tabular data. Uses https://github.com/glittershark/reactable under the hood to render the table.

![table](https://idyll-lang.github.io/images/table.png)

```
[Table data:`[{columnName1: value, columnName2: value}, {columnName1: value, {columnName2: value}}]` /]
```

### VegaLite

Render a [Vega Lite](https://vega.github.io/vega-lite/) spec, using https://github.com/kristw/react-vega-lite.

```
[data name:"myData" src:"my-dataset.json" /]

[VegaLite data:myData spec:`{
  mark: "bar",
  encoding: {
    x: {field: "a", type: "ordinal"},
    y: {field: "b", type: "quantitative"}
  }
}`]
```

## Helpers

### Analytics

This component makes it easy to insert a Google Analytics code on your page.

```
[Analytics google:"UA-XXXXXXXXX" /]
```

### Meta

The meta component adds context to the page template when building your app for publication. The following variables are available and will be inserted
as `<meta>` properties into the head of your HTML page if you define them:

* `title` - the page title
* `description` - a short description of your project
* `url` - the canonical URL from this project
* `twitterHandle` - the author's twitter handle, it will create a link in the twitter card
* `shareImageUrl` - the URL of an image to be shared on social media (twitter cards, etc.). This must be a fully qualified URL, e.g. https://idyll-lang.github.io/https://idyll-lang.github.io/images/logo.png.
* `shareImageWidth` - the width of the share image in pixels
* `shareImageHeight` - the height of the share image in pixels


# Custom Components

## Overview

Idyll is designed for people to use their own custom components as well.
Under the hood an Idyll component just needs to be anything that will
function as a React component. If you create a custom component in
JavaScript, point Idyll to the folder where you created it and
everything will just work, no need to worry about compiling, bundling,
or module loading.

For example, this custom component

```
const React = require('react');
const IdyllComponent = require('idyll-component');

class Custom extends IdyllComponent {
  render() {
    return (
      <div {...this.props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = Custom;
```

could be invoked inside of an Idyll file with the
following code:

```
[Custom /]
```

## Idyll Component

The `IdyllComponent` class adds an
`updateProps` method that is used to keep
variables in sync with the rest of the document, and also
adds a property `onEnteredView` that can be used to
trigger events in scroll-based narratives.

### Example

For example, a component can change the value of a
property that it receives, and Idyll will propegate
the change to any bound variables on the page.

```
const React = require('react');
const IdyllComponent = require('idyll-component');

class Incrementer extends IdyllComponent {

  increment() {
    this.updateProps({
      value: this.props.value + 1
    })
  }

  render() {
    return (
      <div onClick={this.increment.bind(this)}>
        Click me.
      </div>
    );
  }
}

module.exports = Incrementer;
```

The `Incrementer` component could then be used as follows:

```
[var name:"clickCount" value:0 /]

[Incrementer value:clickCount /]
[DisplayVar var:clickCount /]
```

Notice that even thought the `Incrementer` component doesn't know
anything about the variable `clickCount`, it will still correctly
update.

Of course, this trivial example could be accomplished using built-in components:

```
[var name:"clickCount" value:0 /]

[Button onClick:`clickCount+=1` ]Click Me.[/Button]
[DisplayVar var:clickCount /]
```

## Name Resolution

Components lookup is based on filenames. If your component name 
is in `CamelCase`, it will automatically be converted to `kebab-case`,
so for example if you want to create a component named `CustomComponent`,
it should be stored in a file called `custom-component.js`.

Custom component are meant for times when more complex and custom
code is needed. By default Idyll will look for your custom components 
inside of a folder called `components/`. If you wish to change the custom 
component path, specify it with the `--components` option, e.g. 
`idyll index.idl --css styles.css --components custom/component/path/`.



# Variables and Datasets

In addition to rendered components, Idyll supports datasets and variables.
These are declared in the same way:

```
[var name:"myVar" value:5 /]
[data name:"myDataset" source:"data.json" /]
```

The above code declares a variable `myVar` and initializes it
with the value 5. It also imports a dataset from a JSON file.

Once a variable or dataset is initialized it can be used as an input to a component.
For example, the following code declares a variable `myVar`, and uses
it as input to two components.

```
[var name:"myVar" value:5 /]
[Range min:0 max:10 value:myVar /]
[DisplayVar var:myVar /]
```

Idyll handles all of the updating and rerendering of components for you,
so when someone interacts with the range slider, the display will be updated
automatically!



# Refs

Idyll exposes the `ref` property to allow you to refer to specific components in
property expressions.

```
[Component ref:"thisComponent" propName:`refs.thisComponent`  /]
```

The ref property allows you to update the state of one component based on properties of another. Idyll
provides some utilities automatically, for example keeping track of the position
of a component on the page, and how far through a component's content the reader has
scrolled.

Each ref object has the following properties:

```js
{
  domNode: node,
  scrollProgress: {
    x: number,
    y: number
  },
  size: {
    x: number,
    y: number
  },
  position: {
    left: number,
    top: number,
    right: number,
    bottom: number
  }
}
```

For example:

```
[section ref:'section' style:`{ opacity: 1 - refs.section.scrollProgress.y }`]

Lorem ipsum...
...
lots of text here
...

[/section]
```

The above code will create a section of text that fades out as the user scrolls to the bottom of it.
`scrollProgress.y` in this case is a value from 0 to 1 that Idyll automatically computes,
providing the percentage that a user has scrolled through a certain component.



# Building your Idyll project for the web

Once you are happy with your project, the `idyll` command-line tool can also be used to
build a stand alone JavaScript bundle. If you used the Idyll project generator, npm tasks
to build and deploy the project to github pages are available. Once you've initialized your
project with a repo on github, run the command

```sh
$ npm run deploy
```

this will compile the assets and push it to github
pages. Note that the [meta component](https://idyll-lang.github.io/components-built-in#meta)
is useful for inserting metadata into the compiled output.

If you are using the project generator, that's all you need to know about deploying. Continue reading
to learn more about the nuts and bolts of the process.

If you want to use the `idyll` command line tool directly and build the JavaScript bundle, pass in
the `--build` flag.

```sh
$ idyll my-file.idl --build > bundle.js
```

This can be combined with other
useful tools to quickly generate a webpage. For example,
the `indexhtmlify` package will create a barebones HTML page,
properly inserting the

```
$ npm install -g indexhtmlify
$ idyll my-file.idl --build | indexhtmlify --style styles.css > idyll.html
```

The command that the generator uses is

```
$ cp -r {images,styles.css} build/; idyll index.idl --build | uglifyjs > build/index.js && gh-pages -d ./build
```

which copies default static asset folders to the build directory, compiles and minifies the JavaScript, and
then uses the `gh-pages` package to push the resulting folder to your `gh-pages` branch on Github.

