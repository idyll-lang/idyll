import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'
import React from 'react'
import Highlight from 'react-highlight'

// TODO ask if we should keep the local css/highlight.js file if we're just gonna end up using server instead
// cause if we can get the local stuff to work, we can easily change the background color.
// Also, flipping between pages does not make highlight load (possibly bc of highlightOnLoad command)
// so must have a work around

var codeStyle = {
  background: '#4C4B63'
};

export default ({ url }) => (
  <Layout url={url}>
    <link rel="stylesheet" href="../../../static/styles/tomorrow-night-eighties.css" />
    <div>

      <h1>Embedding Idyll in an existing web page</h1>

      <p>The Idyll runtime is available as a React
      component, allowing you to embed interactive
      Idyll content anywhere on the web.</p>

      <p>To do this, you must first install the dependencies:</p>

      <Highlight className='javascript'>$ npm i --save idyll-document idyll-components
      </Highlight>

      <p>then, add it to your page. If you are already using React, you
      can include this as a standard component:</p>

      <Highlight className='javascript'>
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
      </Highlight>

      <p>If not, you'll also need to install <code>react</code> and <code>react-dom</code>:</p>

      <Highlight className='javascript'>$ npm i --save react react-dom
      </Highlight>

      <p>and can embed it like this:</p>

      <Highlight className='javascript'>
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
      </Highlight>

    </div>
  </Layout>
)

