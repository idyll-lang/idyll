import Link from 'next/link'
import Layout from '../../../components/layout'
import Highlight from 'react-highlight'
import markdown from 'markdown-in-js'

export default ({ url }) => (
  <Layout url={url}>
    <link rel="stylesheet" href="../../../static/styles/tomorrow-night-eighties.css" />
    <div>
      <h1>Custom Components</h1>
      <h2>Overview</h2>

      <p>Under the hood an Idyll component is anything that will
function as a React component. If you create a custom component in
JavaScript, point Idyll to the folder where you created it and it will
be available in your markup.</p>

      <p>For example, this custom component</p>

      <Highlight className='javascript'>
        {`// custom.js
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

module.exports = Custom;`}
      </Highlight>

      <p>would be invoked inside of an Idyll file with the
following code:</p>

      <pre><code>{`[Custom /]`}</code></pre>

      <h2>Updating the Document</h2>

      <p>Idyll provides a way for your components to push state changes back up to the
document. This is how a component is able to affect change through the document.
An <code>updateProps</code> method is injected onto the <code>props</code> object that your
                                                                                                                                                                                                                                                custom component receives. This function can be called to update variable values
and propagate those changes to the rest of the Idyll document.</p>

      <h3>Example</h3>
      <p>For example, a component can change the value of a
property that it receives, and Idyll will propagate
the change to any bound variables on the page.</p>

      <Highlight className='javascript'>
        {`const React = require('react');
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

module.exports = Incrementer;`}
      </Highlight>

      <p>The <code>Incrementer</code> component could then be used as follows:</p>

      <pre><code>{`[var name:"clickCount" value:0 /]

[Incrementer value:clickCount /]
[Display value:clickCount /]`}</code></pre>

      <p>Notice that even though the <code>Incrementer</code> component doesn't know
      anything about the variable <code>clickCount</code>, it will still correctly
update.</p>

      <h2>Name resolution</h2>

      <p>Components lookup is based on filenames. If your component name
is <code>MyComponent</code>, it will match files like <code>mycomponent.js</code> or <code>my-component.js</code>.
The component filenames are case insensitive.</p>

      <p>Custom component are meant for times when more complex and custom
      code is needed. By default Idyll will look for your custom components
inside of a folder called <code>components/</code>. If you wish to change the custom
        component path, specify it with the <code>--components</code> option, e.g.</p>
      <p><code>idyll index.idl --css styles.css --components custom/component/path/</code>.</p>

      <h2>Manipulating component children</h2>

      <p>If your component needs to modify the render tree of its children,
<a href="https://github.com/idyll-lang/idyll-component-children"> https://github.com/idyll-lang/idyll-component-children</a> is a helper library
        to filter and map the component's children.</p>

      <p>
        Continue to learn how to use{' '}
        <Link href="/docs/components/scrolling-and-refs"><a>references</a></Link>
        {' '}to make your page more dynamic.
      </p>
    </div>
  </Layout>
)