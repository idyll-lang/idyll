import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'


const Content = () => markdown`

# Embedding Idyll in an existing web page

The Idyll runtime is available as a React
component, allowing you to embed interactive
Idyll content anywhere on the web.

To do this, you must first install the dependencies:

\`\`\`sh
$ npm i --save idyll-document idyll-compiler idyll-components
\`\`\`

then, add it to your page. If you are already using React, you
can include this as a standard component:

\`\`\`javascript

import IdyllDocument from 'idyll-document';
import compile from 'idyll-compiler';
import * as components from 'idyll-components';

// An example functional component
(props) => {
  const { idyllMarkup } = props;
  return (
    <IdyllDocument
      ast={ compile(idyllMarkup) }
      components={ components }
      datasets={ {} } />
  )
}

\`\`\`

If not, you'll also need to install \`react\` and \`react-dom\`:

\`\`\`sh
$ npm i --save react react-dom
\`\`\`

and can embed it like this:

\`\`\`javascript

import React from 'react';
import ReactDOM from 'react-dom';
import IdyllDocument from 'idyll-document';
import compile from 'idyll-compiler';
import * as components from 'idyll-components';

// You must provide idyllMarkup
// and the container element (a DOM node).

ReactDOM.render(
  <IdyllDocument
    ast={ compile(idyllMarkup) }
    components={ components }
    datasets={ {} } />,
  containerElement
)

\`\`\`
`


export default ({ url }) => (
  <Layout url={ url }>
    <div>
      <h1>Embedding Idyll in an existing web page</h1>

      <p>The Idyll runtime is available as a React
      component, allowing you to embed interactive
      Idyll content anywhere on the web.</p>

      <p>To do this, you must first install the dependencies:</p>

      <pre><code class="sh language-sh">$ npm i --save idyll-document idyll-compiler idyll-components
      </code></pre>

      <p>then, add it to your page. If you are already using React, you
      can include this as a standard component:</p>

      <pre><code class="javascript language-javascript">
{`import IdyllDocument from 'idyll-document';
import compile from 'idyll-compiler';
import * as components from 'idyll-components';

// An example functional component
(props) => {
  const { idyllMarkup } = props;
  return (
    <IdyllDocument
      ast={ compile(idyllMarkup) }
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
import compile from 'idyll-compiler';
import * as components from 'idyll-components';

// You must provide idyllMarkup
// and the container element (a DOM node).

ReactDOM.render(
  <IdyllDocument
    ast={ compile(idyllMarkup) }
    components={ components }
    datasets={ {} } />,
  containerElement
)
`}
      </code></pre>
    </div>
  </Layout>
)
