/**
 * NOTE - this file does not get compiled from
 * ES6 --> ES5. Everything in here should be
 * standards compliant old-school JavaScript, with
 * the exception of the require() function.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var IdyllDocument = require('idyll-document').default;
var mountNode = document.getElementById('idyll-mount');

// Included only so that VegaLite will
// work properly with our ecosystem.
require('regenerator-runtime/runtime');

var ast = require('__IDYLL_AST__');
var components = require('__IDYLL_COMPONENTS__');
var datasets = require('__IDYLL_DATA__');
require('__IDYLL_SYNTAX_HIGHLIGHT__');

var opts = require('__IDYLL_OPTS__');
var layout = opts.layout;
var theme = opts.theme;
var authorView = opts.authorView;

var context = require('__IDYLL_CONTEXT__');

var mountMethod = opts.ssr ? 'hydrate' : 'render';
ReactDOM[mountMethod](
  React.createElement(IdyllDocument, {
    ast: ast,
    components: components,
    context: context,
    datasets: datasets,
    layout: layout,
    theme: theme,
    authorView: authorView
  }),
  mountNode
);
