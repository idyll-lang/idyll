import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout';
import Highlight from 'react-highlight';

export default ({ url }) => (
  <Layout url={url} title={'Idyll Documentation | Plugin System'}>
    <link
      rel="stylesheet"
      href="../../../static/styles/tomorrow-night-eighties.css"
    />
    <div>
      <h1>Plugin System</h1>

      <h2>Using Plugins</h2>

      <p>
        Plugins are sorted into two categories, compiler plugins and runtime
        plugins. Compiler plugins can affect how the project builds or modify
        the abstract syntax tree that Idyll produces. Runtime plugins can
        inspect and affect Idyll's reactive variable system in the browser.
      </p>

      <p>See each plugin for specific installation and usage instructions.</p>

      <h3>Compiler Plugins</h3>
      <ul>
        <li>
          <a href="https://github.com/idyll-lang/idyll-plugin-spellcheck">
            Spellcheck
          </a>
        </li>
        <li>
          <a href="https://github.com/idyll-lang/idyll-plugin-table-of-contents">
            Table of Contents
          </a>
        </li>
        <li>
          <a href="https://github.com/idyll-lang/idyll-plugin-revision">
            Git Revisions
          </a>
        </li>
      </ul>
      <h3>Runtime Plugins</h3>
      <ul>
        <li>
          <a href="https://github.com/idyll-lang/idyll-plugin-url-state">
            URL State Synchronization
          </a>{' '}
          - serialize the article state into the URL. Allows readers to share
          the article in a particular configuration.
        </li>
        <li>
          <a href="https://github.com/idyll-lang/idyll-analytics">Analytics</a>{' '}
          - collect detailed usage data to learn how readers are interacting
          with your article.
        </li>
      </ul>
      <p>
        To use multiple runtime plugins simultaneously, use{' '}
        <a href="https://github.com/idyll-lang/idyll-context-compose">
          idyll-context-compose
        </a>
        .
      </p>

      <h2>Developing Plugins</h2>

      <p>
        This section details how to work with the custom hooks exposed by
        Idyll's compiler and runtime.
      </p>

      <h3>Compiler Plugins</h3>

      <p>
        The compiler is responsible for transforming Idyll markup into a
        machine-readable abstract syntax tree (AST). You may provide custom
        transformations for processing the AST at compile time.
      </p>

      <p>These transformations are implemented as JavaScript modules.</p>

      <Highlight className="javascript">
        {`const AST = require('idyll-ast');

module.exports = (ast) => {
  return AST.appendNode(ast, AST.createNode('div', {}, 'Hello World!') );
};`}
      </Highlight>

      <p>
        The above is code for a simple plugin that will append a div to the end
        of any AST that is provided. The{' '}
        <a href="https://github.com/idyll-lang/idyll/tree/master/packages/idyll-ast">
          idyll-ast
        </a>{' '}
        module provides useful helper functions for manipulating the AST
        structure.
      </p>

      <p>
        To add a compiler postprocessor to your project, update the
        configuration in package.json.
      </p>

      <Highlight className="javascript">
        {`"idyll": {
  "compiler": {
    "postProcessors": ['my-idyll-postprocessor']
  }
}`}
      </Highlight>

      <h3>Runtime Context</h3>

      <p>
        If you want to write custom code that reads or writes to Idyll's
        internal state, you can use the context API. This API provides events
        that fire whenever an Idyll variable is changed, and provides a function
        to push variable updates.
      </p>

      <Highlight className="javascript">
        {`module.exports = (ctx) => {

  // The context has loaded,
  // initial data is available
  ctx.onInitialize(() => {
    const initialState = ctx.data();

    // Once the context has been initialized,
    // you can use the ctx.update() method
    // to modify data
    ctx.update({
       key: value
    })

  })

  // The application has mounted in the browser,
  // the window object is available
  ctx.onMount(() => {

  })

  // An update has been triggered,
  // arguments contain only modified data
  ctx.onUpdate((newData) => {

  })

}`}
      </Highlight>

      <p>
        To configure a custom context locally, you can point Idyll to the file
        where you've implemented this logic, in the package.json config.
      </p>

      <Highlight className="javascript">
        {`"idyll": {
  "context": "./my-context-file.js"
}`}
      </Highlight>
    </div>
  </Layout>
);
