![idyll-text](https://cloud.githubusercontent.com/assets/1074773/24593896/95730fba-17dc-11e7-82dd-ae7335f205b6.png)

If you just want to quickly try out Idyll, we offer an online editor where you can play around and try out the language.

_See https://idyll-lang.github.io/ for full documentation_.

_Join our chatroom on Gitter: https://gitter.im/idyll-lang/Lobby_

# What is Idyll?

Idyll is a tool that makes it easier to author interactive narratives for the web. The goal of the project is to provide a friendly markup language — and an associated toolchain — that can be used to create dynamic, text-driven web pages.

Idyll helps you create documents that use common narrative techniques such as embedding interactive charts and graphs, responding to scroll events, and explorable explanations. Additionally, its readable syntax facilitates collaboration between writers, editors, designers, and programmers on complex projects.

In Idyll the entire document is reactive, built on top of Facebook's React framework. Changes immediately propagate through the entire page, taking the pain out of creating data-driven experiences that respond to reader input. You don't need to know anything about React to use Idyll, but if you do, it is easy to extend with your own custom components.

# Examples

## Full Articles

- The Etymology of Trig Functions - https://mathisonian.github.io/trig/etymology/
- Seattle PD’s Dashcam Problem - https://mathisonian.github.io/dashcam/
- The United Complaints of America - https://mathisonian.github.io/consumer-complaints/

## With Popular JavaScript Libraries

- D3 - https://idyll-lang.github.io/idyll-d3-component/
- regl - https://idyll-lang.github.io/idyll-regl-component/
- Vega Lite - https://idyll-lang.github.io/examples/csv/

## Other Examples

- Lorenz Attractor - https://mathisonian.github.io/lorenz/
- Nonlinear Sliders - https://mathisonian.github.io/idyll/nonlinear-sliders/
- Scrolly Idyll - https://idyll-lang.github.io/idyll/scroll/

# Docs

- Overview
  - [Introduction](https://idyll-lang.github.io/introduction)
  - [Getting Started](https://idyll-lang.github.io/getting-started)
  - [Syntax](https://idyll-lang.github.io/syntax)
  - [Config & Styles](https://idyll-lang.github.io/configuration-and-styles)
- Components
  - [Overview](https://idyll-lang.github.io/components-overview)
  - [Built-in components](https://idyll-lang.github.io/components-built-in)
  - [Custom components](https://idyll-lang.github.io/components-custom)
  - [Refs](https://idyll-lang.github.io/components-refs)
- Publishing
  - [Deploying to the web](https://idyll-lang.github.io/publishing-deploying-to-the-web)

# Contributing to Idyll

Idyll attempts to adhere to the [open open source](http://openopensource.org/) philosophy as much as reasonably possible. Pull requests are very welcome!

To submit a PR do the following:

- [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
- Run `yarn` to install the dependencies. If you don't have yarn installed, see https://yarnpkg.com/en/docs/install
- Make your changes.
- Make sure the tests pass by running `npm test`. If you add a feature, add a test for it.
- Submit the PR!

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.
