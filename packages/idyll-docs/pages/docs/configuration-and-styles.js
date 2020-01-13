import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../components/layout';
import Highlight from 'react-highlight';

const Content = () => markdown`
## Themes and page layout

Idyll exposes two options to help you style your project, \`layout\` and \`theme\`. \`layout\` deals with CSS styles related to how your content is
layed out on the page: width, columns, etc. The \`theme\` option allows you to choose different stylesheets to change the style of the content itself (text color, font, and so on).

If more customization is required, you can provide a custom HTML template, and Idyll will generate articles within that custom template (see the "template" option above).

### Layout

Idyll currently ships with several page layouts that can be used to modify how content is displayed on the page, allowing you to quickly test out different narrative styles
for you project.

#### Centered

The \`centered\` layout puts your content in the center of the page and is mobile responsive.

![centered](/static/images/layout-centered.png)

#### Blog

This is the default layout. The \`blog\` layout is fairly traditional article layout with room in the margin to
put notes and other callouts. See <https://mathisonian.github.io/trig/etymology/> for an example of this layout.

![centered](/static/images/layout-blog.png)

#### None

If you set \`--layout none\` Idyll won't provide any structural CSS, allowing you to customize things to your
heart's content.

### Themes

#### Default

This is the default theme. Use this as a starting point and add CSS to make posts your own.

![centered](/static/images/layout-blog.png)

#### GitHub

This theme is inspired by the style of GitHub README pages.

#### Tufte

The \`Tufte\` theme uses styles from <https://edwardtufte.github.io/tufte-css/>.

![tufte](/static/images/tufte.png)
`;

const ExampleCodeA = `var Idyll = require('idyll');

var idyll = Idyll({
  inputFile: 'my-file.idl'
  output: 'build/',
  htmlTemplate: '_index.html',
  componentFolder: './components/'
  dataFolder: './data',
  layout: 'centered',
  theme: 'default'
});

idyll.build()
     .on('update', () => {}) // the compilation finished.
     .on('error', () => {}) // there was an error
`;

const ExampleCodeB = `var idyll = Idyll();

idyll
  .build('# My Idyll markup')
  .on('update', () => { console.log('Finished.') });
`;

export default ({ url }) => (
  <Layout url={url} title={'Idyll Documentation | Configuration and Styles'}>
    <link
      rel="stylesheet"
      href="../../static/styles/tomorrow-night-eighties.css"
    />
    <h1>Configuration and Styles</h1>
    <p>
      Idyll is typically configured via options set in package.json, but all
      these same options can be configured via command line flags or when using
      Idyll as an API.
    </p>
    <p>
      Idyll looks for package.json file starting from the current directory
      where Idyll was run and searches through the parent directories till the
      root directory for another package.json file. This is useful for multipage
      projects where package.json need not be duplicated for each page. In cases
      where multiple package.json files are present with the same options
      configured, the local package.json will be given higher preference over
      options from package.json found in any parent folder.
    </p>
    <h2>Options</h2>
    <ul>
      <li>
        <b>layout</b> - the name of the layout to use. By default this is
        "blog". More on layouts below.
      </li>
      <li>
        <b>theme</b> - the name of the theme to use. By default this is
        "default". More on themes below.
      </li>
      <li>
        <b>authorView</b> - whether to display component information on the page
        or not. By default this is "false"
      </li>
      <li>
        <b>googleFonts</b> - a list of Google font names to include via CSS.
        This can be an array of strings or a single string.
      </li>
      <li>
        <b>favicon</b> - an ico file to use as the favicon, should be inside of
        the static folder, e.g. "static/favicon.ico".
      </li>
      <li>
        <b>alias</b> - Customize component resolution, for example{' '}
        <code>{`{ "VL": "IdyllVegaLite" }`}</code> would let you use tags like{' '}
        <code>{`[VL /]`}</code> in your markup, instead of{' '}
        <code>{`[IdyllVegaLite /]`}</code>.
      </li>
      <li>
        <b>template</b> - a custom HTML template to use. The default template
        can be found{' '}
        <a href="https://github.com/idyll-lang/idyll/blob/master/packages/idyll-cli/src/client/_index.html">
          here
        </a>
      </li>
      <li>
        <b>components</b> - the path to your custom components. By default this
        points to "components". This can be a string (a single path), or an
        array.
      </li>
      <li>
        <b>css</b> - the path to a CSS file. You can use this to override
        Idyll's default styles.
      </li>
      <li>
        <b>datasets</b> - the path to the folder containing your datasets. By
        default this points to "data/".
      </li>
      <li>
        <b>no-minify</b> - turn code minification off when building for
        production.
      </li>
      <li>
        <b>no-ssr</b> - turn server-side rendering off when building for
        production.
      </li>
      <li>
        <b>output</b> - the folder in which to place build output..
      </li>
      <li>
        <b>inputString</b> - string of Idyll markup. Use this flag to compile a
        string instead of a file.
      </li>
    </ul>
    For example, package.json might contain the following:
    <Highlight className="json">
      {`"idyll": {
  "layout": "blog",
  "theme": "my-custom-theme.css",
  "components": ["./components/", "../some-other-components/"],
  "googleFonts": ["Hanalei Fill"],
  "favicon": "static/favicon.ico",
  "alias": {
    "VL": "IdyllVegaLite"
  }
}`}
    </Highlight>
    <p>
      <em>
        Note, when modifying these options you may need to restart the idyll
        server for the change to take effect.
      </em>
    </p>
    <Content />
    <section>
      <h2>Using Idyll as an API</h2>
      <p>
        You can use Idyll directly from JavaScript as well; this is useful if
        you want to build on top of Idyll. For example, you could make a static
        blog engine that uses Idyll to compile the blog posts.
      </p>
      <h3>Example</h3>
      <Highlight className="javascript">{ExampleCodeA}</Highlight>
      <p>
        If you pass <code>live: true</code> to Idyll, it will continue to watch
        the input files for changes, and will emit the update event each time
        that the output is rebuilt.
      </p>
      <p>You can also compile an input string directly instead of a file:</p>
      <Highlight className="javascript">{ExampleCodeB}</Highlight>
    </section>
    <p>
      Continue to the next section to learn about{' '}
      <Link href="/docs/components">
        <a>Idyll components</a>
      </Link>
      .
    </p>
  </Layout>
);
