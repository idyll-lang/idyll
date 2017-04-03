![idyll-text](https://cloud.githubusercontent.com/assets/1074773/24593896/95730fba-17dc-11e7-82dd-ae7335f205b6.png)

Command line interface for idyll lang. 

*See https://idyll-lang.github.io/ for full documentation*.

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
that act as first class elements in the markup. Idyll also makes it 
easy to create data-driven articles,

```md
[data name:"cooldataset"  src:"cooldata.json" /]

Check out this chart:

[Chart data:cooldataset type:"line" /]
```

and handles variable binding for you

```md
[var name:"myVariable" value:50 ]

This will show a range slider with the value of 
`myVariable`:

[Range value:myVariable min:0 max:100 /]

If a user interacts with it, `myVariable` will get updated, and
any components that use `myVariable` will update as well

[CustomComponent opacity:myVariable /]
```



# Getting Started

The easiest way to get started with Idyll is to use the project generator.
It will help get you set up using custom components, datasets, and stylesheets. 
To use the generator:

```sh
$ npm install -g yo generator-idyll
$ yo idyll
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
* `images/` - A folder for static images.
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


*Continue reading at https://idyll-lang.github.io/*.

