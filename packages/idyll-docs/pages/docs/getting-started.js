import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'


const Content = () => markdown`
# Getting Started

If you just want to quickly try out Idyll, we offer
an [online editor](https://idyll-lang.github.io/editor) where you
can play around and try out the language.

## Installation

To install and use Idyll locally, install it using \`npm\`.
If you don't have \`npm\` installed, first install it by
following [these instructions](https://www.npmjs.com/get-npm).

\`\`\`sh
$ npm install -g idyll
\`\`\`

Note that depending on how \`npm\` is installed, you may have to run the above command prefixed with \`sudo\`. Once the installation has finished, the \`idyll\` command will be available in your shell. To compile a file run \`$ idyll <input-file> --watch\`, this will compile and open the resulting webpage in your browser.

## Creating a project

Idyll provides a built-in project template to help you get started.
To use the generator run

\`\`\`sh
$ idyll create
\`\`\`

and follow the prompts. The generator will produce a structure that looks like this:

\`\`\`sh
$  tree -I node_modules
.
├── components/
├── data/
├── static/
├── index.idyll
├── package.json
└── styles.css
\`\`\`

The files do the following:

* \`index.idyll\` - The main Idyll file, write your text in here.
* \`styles.css\` - By putting CSS in here you can override the default styles.
* \`components/\` - The folder for custom components. Any component defined in this folder can be invoked in the .idl file.
* \`data/\` - If you want to include a dataset in your project, put it in here.
* \`static/\` - A folder for static file such as images.
* \`package.json\` - This file contains all the metadata for your project.

After the project has been created, navigate to the root of the new folder, and run \`idyll\`.
Idyll will compile your project and open it in your web browser. Every time you save the \`index.idyll\` file, the system will automatically recompile
everything and update the page in the browser.

The \`components/default/\` folder contains the default components that Idyll provides. If you need to directly
update one of these components or their styles, feel free - Idyll is built to be customized.
`


export default ({ url }) => (
  <Layout url={ url }>
    <Content />
    <p>
      Continue to the <Link href="/docs/syntax"><a>next section</a></Link> to learn how to use Idyll's syntax.
    </p>
  </Layout>
)
