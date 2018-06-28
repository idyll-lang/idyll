import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'
// TODO ask if we should keep the local css/highlight.js file if we're just gonna end up using server instead
// cause if we can get the local stuff to work, we can easily change the background color.
var codeStyle = {
  background: '#4C4B63'
};

export default ({ url }) => (

    <Layout url={url}>
        <div>
            <link rel="stylesheet"
                href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ocean.min.css" />
            <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
            <script>hljs.initHighlightingOnLoad();</script>
            <h1>Embedding Idyll in an existing web page</h1>

            <p>The Idyll runtime is available as a React
            component, allowing you to embed interactive
      Idyll content anywhere on the web.</p>

            <p>To do this, you must first install the dependencies:</p>

            <pre><code class="sh language-sh">$ npm i --save idyll-document idyll-components
      </code></pre>

            <p>then, add it to your page. If you are already using React, you
      can include this as a standard component:</p>

            <pre><code class="javascript language-javascript" style={codeStyle}>
                {`import IdyllDocument from 'idyll-document';
import * as components from 'idyll-components';

// An example functional component
({ idyllMarkup }) => {
  return (
    <IdyllDocument
      markup={ idyllMarkup }
      components={ components }
      datasets={ {} } />;
  )
}
`}
            </code></pre>

            <p>If not, you'll also need to install <code>react</code> and <code>react-dom</code>:</p>

            <pre><code class="sh language-sh">$ npm i --save react react-dom
      </code></pre>

            <p>and can embed it like this:</p>

            <pre><code class="javascript language-javascript">
                {`import React from 'react';
import ReactDOM from 'react-dom';
import IdyllDocument from 'idyll-document';
import * as components from 'idyll-components';

// You must provide idyllMarkup
// and the container element (a DOM node).
ReactDOM.render(
  <IdyllDocument
    markup={ idyllMarkup }
    components={ components }
    datasets={ {} } />,
  containerElement
)
`}
            </code></pre>
            <pre><code>var deleteMe = 5;</code></pre>
        </div>
    </Layout>
)
