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

      <p>
        See available plugins:
        <ul>
          <li>
            <a href="https://github.com/idyll-lang/idyll-plugins">
              https://github.com/idyll-lang/idyll-plugins
            </a>
          </li>
        </ul>
      </p>

      <p>
        This section details how to work with the custom hooks exposed by
        Idyll's compiler and runtime. If you want to learn about basic
        configuration options and styling,{' '}
        <Link href="/docs/configuration-and-styles">
          <a>see this page</a>
        </Link>
        .
      </p>

      <h2>Compiler Plugins</h2>

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

      <h2>Runtime Context</h2>

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
