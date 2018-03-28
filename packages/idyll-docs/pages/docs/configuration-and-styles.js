import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'


const Content = () => markdown`
# Configuration and Styles

## Command line options

The \`idyll\` command line tool accepts the following options

* \`--components\` the path to your custom components. By default this points to \`components/\`.
* \`--css\` the path to your CSS file. You can use this to override Idyll's default styles, e.g. \`$ idyll index.idl --css my-custom-styles.css\`.
* \`--datasets\` the path to the folder containing your datasets. By default this points to \`data/\`.
* \`--inputString\` a string of Idyll markup. Use this flag to compile a string instead of a file.
* \`--layout\` the name of the layout to use. By default this is \`blog\`. More on layouts below.
* \`--no-minify\` turn code minification off when building for production.
* \`--no-ssr\` turn server-side rendering off when building for production.
* \`--output\` the folder in which to place build output.
* \`--theme\` the name of the theme to use. By default this is \`idyll\`. More on themes below.
* \`--template\` a custom HTML template to use.
* \`--watch\` the watch flag tells Idyll if it should watch files for changes, or just run once and exit.

If you are using Idyll via the project generator, open \`package.json\` to change these options.

## Themes and page layout

Idyll exposes two options to help you style your project, \`layout\` and \`theme\`. \`layout\` deals with CSS styles related to how your content is
layed out on the page: width, columns, etc. The \`theme\` option allows you to choose different stylesheets to change the style of the content itself (text color, font, and so on).

### Layout

Idyll currently ships with several page layouts that can be used to modify how content is displayed on the page, allowing you to quickly test out different narrative styles
for you project.

#### Centered

The \`centered\` layout puts your content in the center of the page and is mobile responsive.

#### Blog

This is the default layout. The \`blog\` layout is fairly traditional article layout with room in the margin to
put notes and other callouts. See <https://mathisonian.github.io/trig/etymology/> for an example of this layout.

#### None

If you set \`--layout none\` Idyll won't provide any structural CSS, allowing you to customize things to your
heart's content.

### Themes

#### Github

This is the default theme, it uses CSS that resembles the styles in GitHub READMEs.

#### Idyll

This theme uses custom styles that go along with Idyll's look and feel. See <https://mathisonian.github.io/trig/etymology/> for an example of this style.

#### Tufte

The \`Tufte\` theme uses styles from <https://edwardtufte.github.io/tufte-css/>.

![tufte](/static/images/tufte.png)
`


const ExampleCodeA =
`var Idyll = require('idyll');

var idyll = Idyll({
  inputFile: 'my-file.idl'
  output: 'build/',
  htmlTemplate: '_index.html',
  componentFolder: './components/'
  dataFolder: './data',
  layout: 'centered',
  theme: 'github'
});

idyll.build()
     .on('update', () => {}) // the compilation finished.
     .on('error', () => {}) // there was an error
`


const ExampleCodeB =
`var idyll = Idyll();

idyll
  .build('# My Idyll markup')
  .on('update', () => { console.log('Finished.') });
`



export default ({ url }) => (
  <Layout url={ url }>
    <Content />

    <section>
      <h2>Using Idyll as an API</h2>
      <p>
        You can use Idyll directly from JavaScript as well; this is useful if you want to build on top of Idyll.
        For example, you could make a static blog engine that uses Idyll to compile the blog posts.
      </p>
      <h3>Example</h3>
      <pre>
        <code className="lang-js">{ ExampleCodeA }</code>
      </pre>
      <p>
        If you pass <code>live: true</code> to Idyll, it will continue to watch the input files for changes,
        and will emit the update event each time that the output is rebuilt.
      </p>
      <p>
        You can also compile an input string directly instead of a file:
      </p>
      <pre>
        <code className="lang-js">{ ExampleCodeB }</code>
      </pre>
    </section>

    <p>
      Continue to the next section to learn about{' '}
      <Link href="/docs/components"><a>Idyll components</a></Link>.
    </p>
  </Layout>
)
