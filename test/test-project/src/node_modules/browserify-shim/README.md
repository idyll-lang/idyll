#browserify-shim [![build status](https://secure.travis-ci.org/thlorenz/browserify-shim.svg?branch=master)](http://travis-ci.org/thlorenz/browserify-shim)

[![NPM](https://nodei.co/npm/browserify-shim.png?downloads=true&stars=true)](https://nodei.co/npm/browserify-shim/)

### Make CommonJS-Incompatible Files Browserifyable

#### package.json

```json
{
  "main": "./js/entry.js",
  "browser": {
    "jquery": "./js/vendor/jquery.js"
  },
  "browserify-shim": {
    "jquery": "$",
    "three": "global:THREE"
  },
  "browserify": {
    "transform": [ "browserify-shim" ]
  },
  "dependencies": {
    "browserify-shim": "~3.2.0"
  }
}
```

    browserify . -d -o bundle.js

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Installation](#installation)
- [Features](#features)
- [API](#api)
	- [You Will Always](#you-will-always)
		- [1. Install browserify-shim dependency](#1-install-browserify-shim-dependency)
		- [2. Register browserify-shim as a transform with browserify](#2-register-browserify-shim-as-a-transform-with-browserify)
		- [3. Provide browserify-shim config](#3-provide-browserify-shim-config)
			- [Short Form vs. Long Form config](#short-form-vs-long-form-config)
	- [You will sometimes](#you-will-sometimes)
		- [a) Expose global variables via `global:*`](#a-expose-global-variables-via-global)
			- [1. add script tag for library you want to expose](#1-add-script-tag-for-library-you-want-to-expose)
			- [2. Add expose global config to `package.json`](#2-add-expose-global-config-to-packagejson)
			- [2.a. Add expose global config to external shim config](#2a-add-expose-global-config-to-external-shim-config)
			- [3. Require library by the name it was exposed as](#3-require-library-by-the-name-it-was-exposed-as)
			- [Why not just `var THREE = window.THREE`?](#why-not-just-var-three-=-windowthree)
		- [b) Use aliases](#b-use-aliases)
		- [c) Provide an external shim config](#c-provide-an-external-shim-config)
		- [d) Diagnose what browserify-shim is doing](#d-diagnose-what-browserify-shim-is-doing)
- [Multi Shim Example including dependencies](#multi-shim-example-including-dependencies)
	- [a) Config inside `package.json` without aliases](#a-config-inside-packagejson-without-aliases)
	- [b) Config inside `package.json` with aliases](#b-config-inside-packagejson-with-aliases)
	- [c) Config inside `./config/shim.js` without aliases](#c-config-inside-configshimjs-without-aliases)
		- [`package.json`](#packagejson)
		- [`shim.js`](#shimjs)
- [More Examples](#more-examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

    npm install browserify browserify-shim

*For a version compatible with browserify@1.x run `npm install browserify-shim@1.x` instead.*

*For a version compatible with the [v2 API](https://github.com/thlorenz/browserify-shim/tree/v2#api) `npm install browserify-shim@2.x` instead.*

## Features

The core features of browserify-shim are:

- Shims **non-CommonJS** modules in order for them to be **browserified** by specifying an alias, the path to the file,
  and the identifier under which the module attaches itself to the global `window` object.
- Includes `depends` for  shimming libraries that depend on other libraries being in the global namespace.
- applies shims configured inside the dependencies of your package

Additionally, it handles the following real-world edge cases:

- Modules that just declare a `var foo = ...` on the script level and assume it gets attached to the `window` object.
  Since the only way they will ever be run is in the global context — "ahem, … NO?!"
- Makes `define` and also `module` be `undefined`, in order to fix [improperly-authored
  libraries](https://github.com/mhemesath/r2d3/blob/918bd076e4f980722438b2594d1eba53a522ce75/r2d3.v2.js#L222) that need
  shimming but try anyway to use AMD or CommonJS. For more info read the comment inside [this
  fixture](https://github.com/thlorenz/browserify-shim/blob/master/test/shim/fixtures/shims/lib-with-exports-define-global-problem.js)
- removes invalid requires, i.e. `require('jquery')` although `'jquery'` isn't installed due to the library being
  improperly published or *installed* incorrectly via a downloader like [bower](http://bower.io/)

Since `browserify-shim` is a proper `browserify` transform you can publish packages with files that need to be shimmed,
granted that you specify the shim config inside the `package.json`.

When `browserify` resolves your package it will run the `browserify-shim` transform and thus shim what's necessary
when generating the bundle.

`browserify-shim` walks upwards from each source file and uses the first `"browserify-shim"` configuration it finds in a `package.json` file. You **can't** shim files outside your project from your project's package. You **can** add multiple `package.json` files as long as browserify-shim can always find a package above each source file with the right configuration.

## API

### You Will Always

#### 1. Install browserify-shim dependency

In most cases you want to install it as a [devDependency](https://npmjs.org/doc/json.html#devDependencies) via:

    npm install -D browserify-shim

#### 2. Register browserify-shim as a transform with browserify

Inside `package.json` add:

```json
{ 
  "browserify": {
    "transform": [ "browserify-shim" ]
  }
}
```

Browserify transforms are run in order and may modify your source code along the way. You'll typically want to include browserify-shim last.

#### 3. Provide browserify-shim config

Inside `package.json` add:

```json
{
  "browserify-shim": {
    "./js/vendor/jquery.js": "$",
    "three": "global:THREE"
  }
}
```

The above includes `./js/vendor/jquery.js` (relative to the `package.json`) in the bundle and exports `window.$`.

Additionally it exposes `window.THREE` as `three`, so you can `var three = require('three')`. More info
[below](#a-expose-global-variables-via-global).

##### Short Form vs. Long Form config

Since `jquery` does not depend on other shimmed modules and thus has no `depends` field, we used the short form to
specify its exports, however the example above is equivalent to:

```json
{
  "browserify-shim": {
    "./js/vendor/jquery.js": { "exports": "$" }
  }
}
```

### You will sometimes

#### a) Expose global variables via `global:*`

In some cases the libraries you are using are very large and you'd prefer to add them via a script tag instead to get
the following benefits:

- faster bundling times since the library is not included in the bundle
- pull libraries from a [CDN](http://en.wikipedia.org/wiki/Content_delivery_network) which allows it to be pulled
  straight from the user's browser cache in case it was downloaded before

We'll show how this works by taking the rather huge yet awesome `THREE.js` library as an example:

##### 1. add script tag for library you want to expose

```html
<!-- index.html -->
<head>
  <meta charset=utf-8 />
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/three.js/r61/three.min.js"></script>
</head>
```

##### 2. Add expose global config to `package.json`

```json
{
  "browserify-shim": {
    "three": "global:THREE"
  }
}
```

##### 2.a. Add expose global config to external shim config 

In case you are using an external shim config, you may achieve the same by specifying the global via an `exports`.

```js
module.exports = {
  'three': { exports: 'global:THREE' }
}
```

[more about external configs here](#c-config-inside-configshimjs-without-aliases)

**Note:** `THREE.js` attaches `window.THREE`.

##### 3. Require library by the name it was exposed as

```js
var THREE = require('three');
```

##### Why not just `var THREE = window.THREE`?

You want to avoid spreading the knowledge that `THREE` is a global and stay consistent in how you resolve dependencies.
Additionally if `THREE` would ever be published to [npm](https://npmjs.org/) and you decide to install it from there,
you don't have to change any of your code since it already is `require`ing it properly.


#### b) Use aliases

You may expose files under a different name via the [`browser` field](https://gist.github.com/defunctzombie/4339901#replace-specific-files---advanced) and refer to them under that alias in the shim config:

```json
{
  "browser": {
    "jquery": "./js/vendor/jquery.js"
  },
  "browserify-shim": {
    "jquery": "$"
  }
}
```

This also allows you to require this module under the alias, i.e.: `var $ = require('jquery')`.

#### c) Provide an external shim config

```json
{
  "browserify-shim": "./config/shim.js"
}
```

The external shim format is very similar to the way in which the shim is specified inside the `package.json`. See
[below](#c-config-inside-configshimjs-without-aliases) for more details.

#### d) Diagnose what browserify-shim is doing

You may encounter problems when your shim config isn't properly setup. In that case you can diagnose them via the
`BROWSERIFYSHIM_DIAGNOSTICS` flag.

Simply set the flag when building your bundle, i.e.: 

    BROWSERIFYSHIM_DIAGNOSTICS=1 browserify -d . -o js/bundle.js

or in a `build.js` script add: `process.env.BROWSERIFYSHIM_DIAGNOSTICS=1` to the top.

## Multi Shim Example including dependencies

Some libraries depend on other libraries to have attached their exports to the window for historical reasons :(.
(Hopefully soon we can truly say that this bad design is history.)

In this contrived example we are shimming four libraries since none of them are commonJS compatible:

- **x** exports **window.$**
- **x-ui** exports nothing since it just **attaches itself to x**. Therefore x-ui depends on x.
- **y** exports **window.Y** and also **depends on x** expecting to find it on the window as $.
- **z** exports **window.zorro** and **depends on x and y**. It expects to find x on the window as $, but y on the window as YNOT, 
which is actually different than the name under which y exports itself.

We will be using the `depends` field in order to ensure that a dependency is included and initialized before a library
that depends on it is initialized.

Below are three examples, each showing a way to properly shim the above mentioned modules.

### a) Config inside `package.json` without aliases

```json
{
  "browserify": {
    "transform": [ "browserify-shim" ]
  },
  "browserify-shim": {
    "./vendor/x.js"    :  "$",
    "./vendor/x-ui.js" :  { "depends": [ "./vendor/x.js" ] },
    "./vendor/y.js"    :  { "exports": "Y", "depends": [ "./vendor/x.js:$" ] },
    "./vendor/z.js"    :  { "exports": "zorro", "depends": [ "./vendor/x.js:$", "./vendor/y.js:YNOT" ] }
  }
}
```

**Note:** the `depends` array consists of entries of the format `path-to-file:export`

### b) Config inside `package.json` with aliases

```json
{
  "browserify": {
    "transform": [ "browserify-shim" ]
  },
  "browser": {
    "x"    :  "./vendor/x.js",
    "x-ui" :  "./vendor/x-ui.js",
    "y"    :  "./vendor/y.js",
    "z"    :  "./vendor/z.js"
  },
   "browserify-shim": {
    "x"    :  "$",
    "x-ui" :  { "depends": [ "x" ] },
    "y"    :  { "exports": "Y", "depends": [ "x:$" ] },
    "z"    :  { "exports": "zorro", "depends": [ "x:$", "y:YNOT" ] }
  }
}
```

**Note:** the `depends` entries make use of the aliases as well `alias:export`

### c) Config inside `./config/shim.js` without aliases

#### `package.json`

```json
{
  "browserify": {
    "transform": [ "browserify-shim" ]
  },
  "browserify-shim": "./config/shim.js"
}
```

#### `shim.js`

```js
module.exports = {
  '../vendor/x.js'    :  { 'exports': '$' },
  '../vendor/x-ui.js' :  { 'depends': { '../vendor/x.js': null } },
  '../vendor/y.js'    :  { 'exports': 'Y', 'depends': { '../vendor/x.js': '$' } },
  '../vendor/z.js'    :  { 'exports': 'zorro', 'depends': { '../vendor/x.js': '$', '../vendor/y.js': 'YNOT' } }
}
```

**Note:** all paths are relative to `./config/shim.js` instead of the `package.json`.

The main difference to `a)` is the `depends` field specification. Instead it being an array of strings it expresses its dependencies as a hashmap:

- **key:** `path-to-file` 
- **value:**  the name under which it is expected to be attached on the window

## More Examples

- [shim-jquery](https://github.com/thlorenz/browserify-shim/tree/master/examples/shim-jquery)
- [expose-jquery](https://github.com/thlorenz/browserify-shim/tree/master/examples/expose-jquery)
- [shim-jquery-external](https://github.com/thlorenz/browserify-shim/tree/master/examples/shim-jquery-external)
- the [tests](https://github.com/thlorenz/browserify-shim/tree/master/test) are a great resource to investigate the
  different ways to configure shims and to understand how shims are applied to packages found inside the `node_modules`
  of your package
