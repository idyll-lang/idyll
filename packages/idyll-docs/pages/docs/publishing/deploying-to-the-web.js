import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../../components/layout'


const Content = () => markdown`
# Building your Idyll project for the web

Once you are happy with your project, the \`idyll\` command-line tool can also be used to
build a stand alone bundle. If you used the Idyll project generator, npm tasks
to build and deploy the project to github pages are available.

## idyll.pub

Once you've initialized your project, run the commands

\`\`\`sh
$ idyll build
$ idyll publish
\`\`\`

this will compile the assets and then publish it on the idyll.pub server. Note that
the [meta component](https://idyll-lang.org/docs/components/default/meta) is
useful for inserting metadata into the compiled output.

If you wish to update the post, simply rerun the \`idyll publish\` command.

*Note: running \`idyll publish\` does not automatically rebuild your project.*

## Other hosting

Idyll's generated output is compatible with other static hosting services as well.

To compile the project, run

\`\`\`sh
$ idyll build
\`\`\`

this will compile files and place them inside of the \`build/\` folder.
`


export default ({ url }) => (
  <Layout url={ url } title={'Idyll Documentation | Deploying an Idyll article to the web.'} >
    <Content />
  </Layout>
)
