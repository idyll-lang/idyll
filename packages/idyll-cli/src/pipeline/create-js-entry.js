module.exports = ({
  ast,
  components,
  data,
  options,
  syntaxHighlighting,
  context
}) => {
  return `
import React from 'react';
import ReactDOM from 'react-dom';

import IdyllDocument from 'idyll-document';

var mountNode = document.getElementById('idyll-mount');

var ast = ${JSON.stringify(ast)};


${components
    .map(([k, p], i) => {
      return `import _component_${i} from '${p}'`;
    })
    .join('\n')}

var components = {};
${components
    .map(([k, p], i) => {
      return `components["${k}"] = _component_${i}`;
    })
    .join('\n')}


var datasets = ${JSON.stringify(data)};

${syntaxHighlighting}

var opts = ${JSON.stringify(options)};
var layout = opts.layout;
var theme = opts.theme;
var authorView = opts.authorView;

var context = require("${context}");

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
  `;
};
