import Link from 'next/link'
import Layout from '../../../components/layout'
import showdown from 'showdown'

showdown.setFlavor('github')


const mdConverter = new showdown.Converter()


const Content = () => mdConverter.makeHtml(`
# Viewport Events

The following events are added as properties to all Idyll components:

* \`onEnterView\` - triggered when a component partially enters the viewport.
* \`onEnterViewFully\` - triggered when a component fully enters the viewport.
* \`onExitView\` - triggered when a component partially exits the viewport.
* \`onExitViewFully\`  - triggered when a component fully enters the viewport.

To customize the position at which these events get triggered (e.g. to trigger the \`onEnterView\` event only
after a component is already 100 pixels inside the viewport), the \`scrollOffset\` property can be used.

\`\`\`
A standard trigger
[MyComponent onEnterView:\`stateVar++\` /]

Add a scroll offset of -100 pixels to both the top and bottom of the viewport.
This means that the event will get triggered when the component is 100 pixels
outside of the viewport.
[MyComponent onEnterView:\`stateVar++\` scrollOffset:-100 /]

Add a different offset to the top and bottom of the viewport
[MyComponent onEnterView:\`stateVar++\` scrollOffset:\`{ top: -200, bottom: 200 }\` /]
\`\`\`


# Refs

Idyll exposes the \`ref\` property to allow you to refer to specific components in
property expressions.

\`\`\`
[Component ref:"thisComponent" propName:\`refs.thisComponent\`  /]
\`\`\`

The ref property allows you to update the state of one component based on properties of another. Idyll
provides some utilities automatically, for example keeping track of the position
of a component on the page, and how far through a component's content the reader has
scrolled.

Each ref object has the following properties:

\`\`\`js
{
  domNode: node,
  isInViewport: boolean,
  isFullyInViewport: boolean,
  isAboveViewport: boolean,
  isBelowViewport: boolean
  top: number // distance from the top of the document to the top of this element.
  bottom: number // distance from the top of the document to the bottom of this watcher.
  height: number // top - bottom.
}
\`\`\`
`)


export default ({ url }) => (
  <Layout url={ url }>
    <div dangerouslySetInnerHTML={ {__html: Content()} } />
    <p>
      You've learned all about Idyll! All that's left is{' '}
      <Link href="/docs/publishing/deploying-to-the-web">
        <a>deploying your project to the web</a>
      </Link>.
    </p>
  </Layout>
)
