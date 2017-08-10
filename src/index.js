
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./app');

// Add an empty div for React to mount in
const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(
  <App  />,
  mountNode
);