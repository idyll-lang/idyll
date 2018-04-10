
const exampleGroups = [
  {
    title: 'Articles and blog posts',
    examples: [
      {
        label: 'Barnes Hut',
        href: 'https://jheer.github.io/barnes-hut/',
        image: 'barnes-hut.png',
        sourceUrl: "https://github.com/jheer/barnes-hut"
      },
      {
        label: 'Kernel Density Estimation',
        href: 'https://mathisonian.github.io/kde/',
        image: 'https://mathisonian.github.io/kde/images/share.png',
        sourceUrl: "https://github.com/mathisonian/kde"
      },
      {
        label: 'The Etymology of Trig Functions',
        href: 'https://mathisonian.github.io/trig/etymology/',
        image: 'trig.png',
        sourceUrl: "https://github.com/mathisonian/trig/"
      },
      {
        label: 'Autumn Colormaps',
        href: 'https://mathisonian.github.io/idyll/fall-colors/',
        image: 'https://mathisonian.github.io/idyll/fall-colors/images/share.png',
        sourceUrl: "https://github.com/mathisonian/idyll/tree/master/fall-colors"
      },
      {
        label: 'An Idyll Walkthrough',
        href: 'https://mathisonian.github.io/idyll/a-walk-on-the-idyll-side/',
        image: 'walk-on-the-idyll-side.png',
      },
      {
        label: 'Seattle PD’s Dashcam Problem',
        href: 'https://mathisonian.github.io/dashcam/',
        image: 'https://mathisonian.github.io/dashcam/images/share.png',
        sourceUrl: "https://github.com/mathisonian/dashcam"
      },
      {
        label: 'The United Complaints of America',
        href: 'https://mathisonian.github.io/consumer-complaints/',
        image: 'complaints-2.gif',
        sourceUrl: 'https://github.com/mathisonian/consumer-complaints'
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
        sourceUrl: "https://github.com/idyll-lang/idyll-d3-component/tree/master/examples/basic"
      },
      {
        label: 'regl',
        href: 'https://idyll-lang.github.io/idyll-regl-component/',
        image: 'regl.png',
        sourceUrl: "https://github.com/idyll-lang/idyll-regl-component/tree/master/examples/basic"
      },
      {
        label: 'Vega Lite',
        href: 'https://idyll-lang.github.io/examples/csv/',
        image: 'vl.png',
        sourceUrl: "https://github.com/idyll-lang/examples/tree/master/csv"
      },
      {
        label: 'Firebase',
        href: 'https://mathisonian.github.io/idyll/firebase/',
        image: 'firebase.png',
        sourceUrl: "https://github.com/mathisonian/idyll/tree/master/firebase"
      },
      {
        label: 'Apparatus',
        href: 'https://mathisonian.com/writing/apparatus',
        image: 'apparatus.png',
        sourceUrl: 'https://github.com/mathisonian/mathisonian.github.io/blob/master/pages/writing/apparatus.js'
      }
    ],
  },
  {
    title: 'Other examples',
    examples: [
      {
        label: 'Lorenz Attractor',
        href: 'https://mathisonian.github.io/lorenz/',
        image: 'lorenz.png',
        sourceUrl: 'https://github.com/mathisonian/lorenz'
      },
      {
        label: 'Nonlinear Sliders',
        href: 'https://mathisonian.github.io/idyll/nonlinear-sliders/',
        image: 'nonlinear.png',
        sourceUrl: 'https://github.com/mathisonian/idyll/tree/master/nonlinear-sliders'
      },
      {
        label: 'Scrolly Idyll',
        href: 'https://idyll-lang.github.io/idyll/scroll/',
        image: 'scroll.gif',
      },
    ],
  },
]


function slugify(text)
{
  return text.toString().split(/([A-Z][a-z]+)/).join('-').toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const indexedItems = {};
exampleGroups.forEach((group) => {
  group.examples.forEach((example) => {
    const slug = slugify(example.label);
    indexedItems[slug] = example;
  })
})

export { indexedItems };
export default exampleGroups;