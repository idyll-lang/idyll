import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'
import ExampleGroup from '../../components/example-group'
import Donate from '../../components/donate-link'
import compile from 'idyll-compiler';
import * as components from 'idyll-components';
import IdyllDocument from 'idyll-document';

const idyllMarkup = `
# Introduction


Idyll can be used to create [explorable explanations](https://explorabl.es/), write data-driven stories, and add interactivity to blog engines and content management systems. The tool can generate standalone webpages or be embedded in  existing pages. Choose from built-in themes or provide custom CSS.

![/static/images/fugazi.gif](/static/images/fugazi.gif)

We offer a [free public hosting service](https://idyll.pub) so that you can publish your creations to the web in a matter of seconds. Continue reading to learn more about the project, or see our [example gallery](/gallery).

## Familiar Markup

Idyll starts with the same principles as markdown, and uses a lot of the same syntax. If you want text to appear in your output, just start writing.

## Beyond Static Text

The real power of Idyll comes when you want to use JavaScript to enrich your writing. Special syntax allows you to embed JavaScript inline with your text. Idyll comes with a variety of components that can be used out-of-the-box to create rich documents.

To include a JavaScript component, you can add tags to your text like this:

\`\`\`
[ComponentName property:variableValue onEvent:\`variableValue = 5\` /]
\`\`\`

Each tag corresponds to a React component, which receives the provided properties. Properties can be reactive variables or expressions,
Idyll handles the logic to watch for variable updates and re-render components as needed.


## Example Usage

Idyll includes a number of useful components by default, for example here is a chart component, plotting a sine wave.

[Chart
  equation:\` (t) => Math.sin(t)\`
  domain:\`[0, 2 * Math.PI]\`
  samplePoints:1000 /]

\`\`\`
[Chart
  equation:\` (t) => Math.sin(t)\`
  domain:\`[0, 2 * Math.PI]\`
  samplePoints:1000 /]
\`\`\`

Currently it's static, but variables can be used to parameterize the output, allowing the chart to dynamically update. For example, we can give it a
variable domain, and a variable function to plot.

[var name:"func" value:\`Math.sin\` /]
[var name:"domainStart" value:0 /]
[var name:"domainEnd" value:\`2 * Math.PI\` /]


\`\`\`
[var name:"func" value:\`Math.sin\` /]
[var name:"domainStart" value:0 /]
[var name:"domainEnd" value:\`2 * Math.PI\` /]

[Chart
  equation:\` (t) => func(t)\`
  domain:\`[domainStart, domainEnd]\`
  samplePoints:1000 /]
\`\`\`


These variables can be updated based on user actions, for example they can be attached to a button click:


[Chart
  equation:\` (t) => func(t)\`
  domain:\`[domainStart, domainEnd]\`
  samplePoints:1000 /]

[div className:"button-container"]
[Button onClick:\`func = Math.sin\`]sin[/Button]
[Button onClick:\`func = Math.cos\`]cos[/Button]
[/div]

\`\`\`

[Chart ... /]

[Button onClick:\`func = Math.sin\`]sin[/Button]
[Button onClick:\`func = Math.cos\`]cos[/Button]
\`\`\`

or bound to the value of standard input widgets:


[Chart
  equation:\` (t) => func(t)\`
  domain:\`[domainStart, domainEnd]\`
  samplePoints:1000 /]

#### Update Domain

[float position:"left"]
Start: [Range value:domainStart min:\`-4 * Math.PI\` max:0 step:0.01  /]
[/float]
[float position:"right"]
End: [Range value:domainEnd min:0 max:\`4 * Math.PI\` step:0.01  /]
[/float]

\`\`\`
[Chart ... /]

#### Update Domain

Start: [Range value:domainStart min:\`-4 * Math.PI\` max:0 step:0.01  /]
End: [Range value:domainEnd min:0 max:\`4 * Math.PI\` step:0.01  /]
\`\`\`


Write your own equation:

[var name:"funcString" value:\`"(x) => x * Math.sin(10 / (x || 1))"\` /]
[derived name:"funcFromString" value:\`eval(funcString)\` /]

[TextInput value:funcString /]

[Chart
  equation:\` (t) => funcFromString ? funcFromString(t) : 0 \`
  domain:\`[domainStart, domainEnd]\`
  samplePoints:1000 /]

#### Update Domain

[float position:"left"]
Start: [Range value:domainStart min:\`-4 * Math.PI\` max:0 step:0.01  /]
[/float]
[float position:"right"]
End: [Range value:domainEnd min:0 max:\`4 * Math.PI\` step:0.01  /]
[/float]

\`\`\`

[var name:"funcString" value:\`"(x) => x * Math.sin(10 / (x || 1))"\` /]
[derived name:"funcFromString" value:\`eval(funcString)\` /]

[TextInput value:funcString /]

[Chart
  equation:\` (t) =>  funcFromString(t) \`
  domain:\`[domainStart, domainEnd]\`
  samplePoints:1000 /]
\`\`\`


## Support

If you like what Idyll is doing, consider [buying a sticker](https://opencollective.com/idyll) to help sustain the project, or
select from one of the other one-time and recurring donation options on Open Collective.

[Donate /]

Idyll is supported by the Interactive Data Lab at the University of Washington, and by Rhizome and The Eutopia Foundation.
![sponsors](/static/images/sponsors.png)


`

export default ({ url }) => (
  <Layout url={ url } title={'Idyll Documentation | An overview.'}>
    <IdyllDocument layout='centered' markup={idyllMarkup} components={Object.assign({}, components, { Donate })} />
    <p style={{marginBottom: 30}}>
      Continue to the <Link href="/docs/getting-started"><a>next section</a></Link> to start using Idyll.
    </p>
    <style global jsx>{`
      .idyll-root img {
        width: 400px;
        display: block;
        margin: 15px auto;
        max-width: 100%;
      }
      .idyll-root img.opencollective {
        width: 200px;
        margin: 30px auto;
      }
      .idyll-root .button-container {
        text-align: center;
        margin: 0 auto;
      }
      .idyll-root .button-container button {
        width: 150px;
        margin: 0px 10px;
        padding: 10px 5px;
        background: black;
        color: white;
      }
      .idyll-root .button-container button {
        width: 150px;
        margin: 0px 10px;
        padding: 10px 5px;
        background: black;
        color: white;
      }

      .idyll-root input[type=text] {
        display: block;
        margin: 0 auto;
        padding: 10px 5px;
        font-size: 18px;
        font-family: 'Fira Mono', monospace;
        width: 100%;
        max-width: 400px;
      }

      .idyll-root .float {
        text-align: center;
      }
    `}</style>
  </Layout>
)
