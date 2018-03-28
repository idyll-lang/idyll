import Link from 'next/link'
import Layout from '../components/basic-layout'
import ExampleGroup from '../components/example-group'

const exampleGroups = [
  {
    title: 'Full articles',
    examples: [
      {
        label: 'The Etymology of Trig Functions',
        href: 'https://mathisonian.github.io/trig/etymology/',
        image: 'trig.png',
      },
      {
        label: 'Seattle PD’s Dashcam Problem',
        href: 'https://mathisonian.github.io/dashcam/',
        image: 'https://mathisonian.github.io/dashcam/images/share.png',
      },
      {
        label: 'The United Complaints of America',
        href: 'https://mathisonian.github.io/consumer-complaints/',
        image: 'complaints-2.gif',
      },
    ],
  },
  {
    title: 'With popular JavaScript libraries',
    examples: [
      {
        label: 'D3',
        href: 'https://idyll-lang.github.io/idyll-d3-component/',
        image: 'd3.png',
      },
      {
        label: 'regl',
        href: 'https://idyll-lang.github.io/idyll-regl-component/',
        image: 'regl.png',
      },
      {
        label: 'Vega Lite',
        href: 'https://idyll-lang.github.io/examples/csv/',
        image: 'vl.png',
      },
    ],
  },
  {
    title: 'Other examples',
    examples: [
      {
        label: 'Lorenz Attractor',
        href: 'https://mathisonian.github.io/lorenz/',
        image: 'lorenz.png',
      },
      {
        label: 'Nonlinear Sliders',
        href: 'https://mathisonian.github.io/idyll/nonlinear-sliders/',
        image: 'nonlinear.png',
      },
      {
        label: 'Scrolly Idyll',
        href: 'https://idyll-lang.github.io/idyll/scroll/',
        image: 'scroll.gif',
      },
    ],
  },
]


const Examples = () => (
  <section>
    <h1>Example Gallery</h1>
    <p>
      If you've made something with Idyll and would like to post it here,
      please <a href="https://github.com/idyll-lang/idyll/issues" target="_blank">open an issue on GitHub</a> with the title "Gallery Example".
    </p>
    {
      exampleGroups.map(eg => <ExampleGroup { ...eg } key={ eg.title } />)
    }
  </section>
)


export default ({ url }) => (
  <Layout url={ url } selected="gallery" >
    <Examples />
  </Layout>
)
