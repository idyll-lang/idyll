import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'


const Content = () => markdown`
# Installing Components from NPM

Additional components can be installed via [npm](https://npmjs.com).

## Suggested Components

* [Apparatus](https://github.com/idyll-lang/idyll-apparatus-component)
* [Vega Lite](https://github.com/idyll-lang/idyll-vega-lite)

## Details

Because Idyll is built on top of React, any React component can
be used in Idyll. If you install a component using \`npm\`, Idyll
will automatically be able to find it without any additional configuration.

For example:

\`\`\`
$ npm install some-react-component
\`\`\`

This could then be used in your markup as

\`\`\`
[SomeReactComponent /]
\`\`\`

Internally, this is equivalent to \`require('some-react-component')\`. If you
need to access a property of the imported module, you can do it like this:

\`\`\`
[SomeReactComponent.nested.Property /]
\`\`\`

This is equivalent to \`require('some-react-component').nested.Property\`.

`


export default ({ url }) => (
  <Layout url={ url }>
    <Content />
    <p>
      Continue to{' '}
      <Link href="/docs/components/custom"><a>custom components</a></Link>.
    </p>
  </Layout>
)
