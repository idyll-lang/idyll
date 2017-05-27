const React = require('react');
const ReactDOM = require('react-dom');

const InteractiveDocument = require('./component');
const mountNode = document.getElementById('idyll-mount');
const ast = require('__IDYLL_AST__');

ReactDOM.render(<InteractiveDocument ast={ast}/>, mountNode);
