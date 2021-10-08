import React from 'react';
import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../components/layout';

const Content = () => markdown`
# Getting Started

If you prefer video
tutorials, [watch the introduction on YouTube](https://www.youtube.com/watch?v=9YvEFdiY0yE).

There's also an [online editor](https://idyll-lang.org/editor) where you
can play around with the language.

## Installation

_Idyll is a program that is used via the command line. If you aren't comfortable with the command line already, I'd recommend watching Daniel Shiffman's [short introduction](https://www.youtube.com/watch?v=oK8EvVeVltE) before starting._

To use Idyll you must first install it using \`npm\`.
If you don't have \`npm\`, first install it by following [these instructions](https://www.npmjs.com/get-npm).

~~~sh
$ npm install -g idyll
~~~

_Note that depending on how \`npm\` is installed, you may have to run the above command prefixed with \`sudo\`._

Once the installation has finished, the \`idyll\` command will be available in your shell.

## Creating a project

Idyll provides a built-in project template to help you get started. Run

~~~sh
$ idyll create
~~~

to create a new project. You can choose either \`article\` or \`multipage\` from the
menu to create a single post or a multipage setup (for making blogs, books, etc.).

For a single post, the generator will produce the following files:

- \`index.idyll\` - The main Idyll file, write your text in here.
- \`styles.css\` - Add any custom styles.
- \`components/\` - Any component defined in this folder can be used in the idyll markup.
- \`data/\` - If you want to include a dataset in your project, put it in here (supports CSV or JSON).
- \`static/\` - A folder for static file such as images.
- \`package.json\` - This file contains all the configuration for your project.

After the project has been created, navigate to the root of the new folder, and run \`idyll\`.
Idyll will compile your project and open it in your web browser. Every time you save the \`index.idyll\` file, the system will automatically recompile
everything and update the page in the browser.
`;

export default ({ url }) => (
  <Layout
    url={url}
    title={'Idyll Documentation | Installation and Getting Started'}
  >
    <Content />
    <p>
      Continue to the{' '}
      <Link href="/docs/syntax">
        <a>next section</a>
      </Link>{' '}
      to learn how to write Idyll markup.
    </p>
  </Layout>
);
