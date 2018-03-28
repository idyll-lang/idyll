import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'


const Content = () => markdown`
# Getting Started

If you just want to quickly try out Idyll, we offer
an [online editor](https://idyll-lang.github.io/editor) where you
can play around and try out the language.


## Quickstart

To install and use Idyll locally, install it using \`npm\`.
If you don't have \`npm\` installed, first install it by
following [these instructions](https://www.npmjs.com/get-npm).

\`\`\`sh
$ npm install -g idyll
\`\`\`

Once the installation has finished, the \`idyll\` command will be available in your shell. To compile a file run \`$ idyll <input-file>\`, this will compile and open the resulting webpage in your browser.

## Project generator

If you are working on a more in-depth project, we provide a project
generator to help set with the initial configuration.
It will help get you set up using custom components, datasets, and stylesheets.
To use the generator:

\`\`\`sh
$ npm install -g yo generator-idyll
$ yo idyll
\`\`\`

The generator will produce a structure that looks like this:

\`\`\`sh
$  tree -I node_modules
.
├── _index.html
├── components
│   ├── custom-component.js
│   └── default
│       ├── styles
│       │   └── ... default component stylesheets
│       └── ... default components in here
├── data
│   └── example-data.json
├── images
│   └── idyll.png
├── index.idl
├── package.json
└── styles.css
\`\`\`

The files do the following:

* \`index.idl\` - The main Idyll file, write your text in here.
* \`styles.css\` - By putting CSS in here you can override the default styles.
* \`components/\` - The folder for custom components. Any component defined in this folder can be invoked in the .idl file.
* \`data/\` - If you want to include a dataset in your project, put it in here.
* \`images/\` - A folder for static images.
* \`_index.html\` - A barebones HTML file that will be used if you publish your project to the web.
* \`package.json\` - This file contains all the metadata for your project.

To get started, from a terminal in that directory run \`npm start\` and Idyll will compile your
file and open it in your web browser. Every time you save the \`index.idl\` file, the system will automatically recompile
everything and update the page in the browser.

The \`components/default/\` folder contains the default components that Idyll provides. If you need to directly
update one of these components or their styles, feel free - Idyll is built to be customized.

If you want to configure the paths or build steps that Idyll uses, open \`package.json\` and update the \`scripts\` section. These options are discussed in greater detail later on in the documentation.
`


export default ({ url }) => (
  <Layout url={ url }>
    <Content />
    <p>
      Continue to the <Link href="/docs/syntax"><a>next section</a></Link> to learn how to use Idyll's syntax.
    </p>
  </Layout>
)
