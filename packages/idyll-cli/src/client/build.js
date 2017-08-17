const React = require('react');
const ReactDOM = require('react-dom');

const IdyllDocument = require('idyll-document');
const mountNode = document.getElementById('idyll-mount');

const ast = require('__IDYLL_AST__');
const componentClasses = require('__IDYLL_COMPONENTS__');
const datasets = require('__IDYLL_DATA__');
require('__IDYLL_SYNTAX_HIGHLIGHT__');

ReactDOM.render(
  React.createElement(IdyllDocument, { ast, componentClasses, datasets }),
  mountNode
);
