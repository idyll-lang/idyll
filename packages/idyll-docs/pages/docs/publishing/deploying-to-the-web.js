import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'


const Content = () => markdown`
# Building your Idyll project for the web

Once you are happy with your project, the \`idyll\` command-line tool can also be used to
build a stand alone bundle. If you used the Idyll project generator, npm tasks
to build and deploy the project to github pages are available.

## GitHub pages

Once you've initialized your
project with a repo on github, run the command

\`\`\`sh
$ npm run deploy
\`\`\`

this will compile the assets and push it to github
pages. Note that
the [meta component](https://idyll-lang.github.io/components-built-in#meta) is
useful for inserting metadata into the compiled output.

## Other hosting

Idyll's generated output is compatible with other static hosting services as well.

To compile the project, run

\`\`\`sh
$ npm run build
\`\`\`

this will compile files and place them inside of the \`build/\` folder.
`


export default ({ url }) => (
  <Layout url={ url }>
    <Content />
  </Layout>
)
