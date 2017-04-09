const React = require('react');
const ReactDOM = require('react-dom');

const InteractiveDocument = require('./component');

var mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(<InteractiveDocument />, mountNode);
