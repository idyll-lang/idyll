import Link from 'next/link'
import Layout from '../../../components/layout'
import showdown from 'showdown'

showdown.setFlavor('github')


const mdConverter = new showdown.Converter()


const Content = () => mdConverter.makeHtml(`
# Custom Components

## Overview

Under the hood an Idyll component is anything that will
function as a React component. If you create a custom component in
JavaScript, point Idyll to the folder where you created it and it will
be available in your markup.

For example, this custom component

\`\`\`js
// custom.js
const React = require('react');

class Custom extends React.Component {
  render() {
    const { hasError, updateProps, ...props } = this.props;

    return (
      <div {...props}>
        This is a custom component
      </div>
    );
  }
}

module.exports = Custom;
\`\`\`

would be invoked inside of an Idyll file with the
following code:

\`\`\`
[Custom /]
\`\`\`

## Updating the Document

Idyll provides a way for your components to push state changes back up to the
document. This is how a component is able to affect change through the document.
An \`updateProps\` method is injected onto the \`props\` object that your
custom component receives. This function can be called to update variable values
and propagate those changes to the rest of the Idyll document.

### Example

For example, a component can change the value of a
property that it receives, and Idyll will propagate
the change to any bound variables on the page.

\`\`\`js
const React = require('react');
class Incrementer extends React.Component {

  increment() {
    this.props.updateProps({
      value: this.props.value + 1
    })
  }

  render() {
    return (
      <div onClick={this.increment.bind(this)}>
        Click me.
      </div>
    );
  }
}

module.exports = Incrementer;
\`\`\`

The \`Incrementer\` component could then be used as follows:

\`\`\`
[var name:"clickCount" value:0 /]

[Incrementer value:clickCount /]
[Display value:clickCount /]
\`\`\`

Notice that even thought the \`Incrementer\` component doesn't know
anything about the variable \`clickCount\`, it will still correctly
update.


## Name resolution

Components lookup is based on filenames. If your component name
is \`MyComponent\`, it will match files like \`mycomponent.js\` or \`my-component.js\`.
The component filenames are case insensitive.

Custom component are meant for times when more complex and custom
code is needed. By default Idyll will look for your custom components
inside of a folder called \`components/\`. If you wish to change the custom
component path, specify it with the \`--components\` option, e.g.
\`idyll index.idl --css styles.css --components custom/component/path/\`.
`)

export default ({ url }) => (
  <Layout url={ url }>
    <div dangerouslySetInnerHTML={ {__html: Content()} } />
    <p>
      Continue to learn how to use{' '}
      <Link href="/docs/components/scrolling-and-refs"><a>references</a></Link>
      {' '}to make your page more dynamic.
    </p>
  </Layout>
)
