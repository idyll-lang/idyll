module.exports = ({ ast, components, data, options, context }) => {
  return `
    var React = require('react');
    var ReactDOM = require('react-dom');

    import IdyllDocument from 'idyll-document';

    var mountNode = document.getElementById('idyll-mount');

    var ast = ${JSON.stringify(ast)};
    var components = {${components
      .map(([k, p]) => {
        return `"${k}": require("${p}")`;
      })
      .join(', ')}};
    var datasets = ${JSON.stringify(data)};
    // require('__IDYLL_SYNTAX_HIGHLIGHT__');

    var opts = ${JSON.stringify(options)};
    var layout = opts.layout;
    var theme = opts.theme;
    var authorView = opts.authorView;

    // var context = require('__IDYLL_CONTEXT__');

    var mountMethod = opts.ssr ? 'hydrate' : 'render';
    ReactDOM[mountMethod](
      React.createElement(IdyllDocument, {
        ast: ast,
        components: components,
        // context: context,
        datasets: datasets,
        layout: layout,
        theme: theme,
        authorView: authorView
      }),
      mountNode
    );
  `;
};
