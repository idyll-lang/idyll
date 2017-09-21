import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

// Add an empty div for React to mount in
const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

ReactDOM.render(
  <App  />,
  mountNode
);
