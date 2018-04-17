![idyll-logo](https://user-images.githubusercontent.com/1074773/30891039-807308e2-a2e5-11e7-827e-bce391ad9b1b.png)

<p align="center">
 <a href="https://idyll-lang.github.io/editor">Try Idyll in your browser</a> | <a href="https://idyll-lang.org">Documentation</a> | <a href="https://gitter.im/idyll-lang/Lobby">Chatroom</a> | <a href="https://groups.google.com/forum/#!forum/idyll-lang">Mailing List</a>
</p>

<p align="center">
 <a href="https://travis-ci.org/idyll-lang/idyll"><img src="https://travis-ci.org/idyll-lang/idyll.svg?branch=master" /></a> 
 <a href="https://ci.appveyor.com/project/mathisonian/idyll"><img src="https://ci.appveyor.com/api/projects/status/6e89g4xdbq5twr1o/branch/master?svg=true" /></a> 
 <a href="#backers"><img src="https://opencollective.com/idyll/backers/badge.svg" /></a>
 <a href="#sponsors"><img src="https://opencollective.com/idyll/sponsors/badge.svg" /></a>
</p>

# What is Idyll?

Idyll is a tool that makes it easier to author interactive narratives for the web. The goal of the project is to provide a friendly markup language — and an associated toolchain — that can be used to create dynamic, text-driven web pages.

Idyll helps you create documents that use common narrative techniques such as embedding interactive charts and graphs, responding to scroll events, and explorable explanations. Additionally, its readable syntax facilitates collaboration between writers, editors, designers, and programmers on complex projects.

In Idyll the entire document is reactive, built on top of Facebook's React framework. Changes immediately propagate through the entire page, taking the pain out of creating data-driven experiences that respond to reader input. You don't need to know anything about React to use Idyll, but if you do, it is easy to extend with your own custom components.


# Examples

## Full Articles

* The Etymology of Trig Functions - https://mathisonian.github.io/trig/etymology/
* Seattle PD’s Dashcam Problem - https://mathisonian.github.io/dashcam/
* The United Complaints of America - https://mathisonian.github.io/consumer-complaints/

## With Popular JavaScript Libraries

* D3 - https://idyll-lang.github.io/idyll-d3-component/
* regl - https://idyll-lang.github.io/idyll-regl-component/
* Vega Lite - https://idyll-lang.github.io/examples/csv/

## Other Examples

* Lorenz Attractor - https://mathisonian.github.io/lorenz/
* Nonlinear Sliders - https://mathisonian.github.io/idyll/nonlinear-sliders/
* Scrolly Idyll - https://idyll-lang.github.io/idyll/scroll/


# Docs

* Overview
  * [Introduction](https://idyll-lang.github.io/introduction)
  * [Getting Started](https://idyll-lang.github.io/getting-started)
  * [Syntax](https://idyll-lang.github.io/syntax)
  * [Config & Styles](https://idyll-lang.github.io/configuration-and-styles)
* Components
  * [Overview](https://idyll-lang.github.io/components-overview)
  * [Built-in components](https://idyll-lang.github.io/components-built-in)
  * [Custom components](https://idyll-lang.github.io/components-custom)
  * [Refs](https://idyll-lang.github.io/components-refs)
* Publishing
  * [Deploying to the web](https://idyll-lang.github.io/publishing-deploying-to-the-web)


# Contributing to Idyll

Idyll attempts to adhere to the [open open source](http://openopensource.org/) philosophy as much as reasonably possible. Pull requests are very welcome!

## Dev Dependencies

To work with Idyll's codebase, you must have [Lerna](https://github.com/lerna/lerna) and [yarn](https://yarnpkg.com/en/docs/install) installed.

## Making Changes 

To submit a PR do the following:

* [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
* Run `lerna bootstrap` from inside the `idyll` folder to install the dependencies and link all of the packages together. 
* Make your changes.
* Test your changes:
  * Make sure the tests pass by running `npm test`. If you add a feature, add a test for it.
  * If you'd like to test these changes in a local Idyll project, first navigate to the `idyll-cli` package locally and run `yarn link`, then you can run `yarn link idyll` inside of your project, and your local dev version of idyll will be used. 
* Submit the PR!

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.

This project exists thanks to all the people who contribute.
<a href="https://github.com/idyll-lang/idyll/graphs/contributors"><img src="https://opencollective.com/idyll/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers!

<a href="https://opencollective.com/idyll#backers" target="_blank"><img src="https://opencollective.com/idyll/backers.svg?width=890"></a>


## Sponsors

<img width="400px" src="https://idyll-lang.org/static/images/sponsors.png" />

Support this project by [becoming a sponsor](https://opencollective.com/idyll). Your logo will show up here with a link to your website.



