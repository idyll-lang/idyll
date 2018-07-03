import Link from 'next/link'
import Layout from '../../../components/layout'
import markdown from 'markdown-in-js'
import Highlight from 'react-highlight'

export default ({ url }) => (
  <Layout url={url}>
    <link rel="stylesheet" href="../../../static/styles/tomorrow-night-eighties.css" />
    <div>
      <h1>Viewport Events</h1>

      <p>The following events are added as properties to all Idyll components:</p>
      <ul>
        <li><code>onEnterView</code> - triggered when a component partially enters the viewport.</li>
        <li><code>onEnterViewFully</code> - triggered when a component fully enters the viewport.</li>
        <li><code>onExitView</code> - triggered when a component partially exits the viewport.</li>
        <li><code>onExitViewFully</code> - triggered when a component fully enters the viewport.</li>
      </ul>

      <p>To customize the position at which these events get triggered (e.g. to trigger the <code>onEnterView</code> event only
      after a component is already 100 pixels inside the viewport), the <code>scrollOffset</code> property can be used.</p>

      <pre><code>{`A standard trigger
[MyComponent onEnterView:\`stateVar++\` /]

Add a scroll offset of -100 pixels to both the top and bottom of the viewport.
This means that the event will get triggered when the component is 100 pixels
outside of the viewport.
[MyComponent onEnterView:\`stateVar++\` scrollOffset:-100 /]

Add a different offset to the top and bottom of the viewport
[MyComponent onEnterView:\`stateVar++\` scrollOffset:\`{ top: -200, bottom: 200 }\` /]`}</code></pre>

      <h1>Refs</h1>
      <p>Idyll exposes the <code>ref</code> property to allow you to refer to specific components in
      property expressions.</p>

      <pre><code>[Component ref:"thisComponent" propName:`refs.thisComponent`  /]</code></pre>

      <p>The <code>ref</code> property allows you to update the state of one component based on properties of another. Idyll
      provides some utilities automatically, for example keeping track of the position
      of a component on the page, and how far through a component's content the reader has
      scrolled.</p>

      <p>Each <code>ref</code> object has the following properties:</p>

      <Highlight className='javascript'>{`{
  domNode: node,
  isInViewport: boolean,
  isFullyInViewport: boolean,
  isAboveViewport: boolean,
  isBelowViewport: boolean
  top: number // distance from the top of the document to the top of this element.
  bottom: number // distance from the top of the document to the bottom of this watcher.
  height: number // top - bottom.
}`}</Highlight>

      <p>
        You've learned all about Idyll! All that's left is{' '}
        <Link href="/docs/publishing/deploying-to-the-web">
          <a>deploying your project to the web</a>
        </Link>.</p>
    </div>
  </Layout>
)