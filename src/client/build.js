const React = require('react');
const ReactDOM = require('react-dom');

const InteractiveDocument = require('./component');
var mountNode = document.getElementById('idyll-mount');

ReactDOM.render(<InteractiveDocument />, mountNode);
