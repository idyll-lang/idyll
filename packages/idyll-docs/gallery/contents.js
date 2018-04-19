
const exampleGroups = [
  {
    title: 'Explorable Explanations',
    examples: [
      {
        label: 'The Barnes-Hut Approximation',
        subtitle: "Efficient computation of N-body forces",
        href: 'https://jheer.github.io/barnes-hut/',
        image: 'barnes-hut.png',
        sourceUrl: "https://github.com/jheer/barnes-hut"
      },
      {
        label: 'Kernel Density Estimation',
        subtitle: 'An interactive explanation of the statistical technique',
        href: 'https://mathisonian.github.io/kde/',
        image: 'kde.png',
        sourceUrl: "https://github.com/mathisonian/kde"
      },
      {
        label: 'The Etymology of Trig Functions',
        subtitle: 'A graphic walkthrough of mathematical history',
        href: 'https://mathisonian.github.io/trig/etymology/',
        image: 'trig.png',
        sourceUrl: "https://github.com/mathisonian/trig/"
      },
      {
        label: 'Travelling Salesman Algorithms',
        subtitle: 'From Naive to Christofide',
        href: 'https://cse442-17f.github.io/Traveling-Salesman-Algorithms/',
        image: 'travelling-salesman.png'
      },
      {
        label: 'Multi-Armed Bandits',
        subtitle: 'An exploration of epsilon greedy and UCB1 algorithms',
        href: 'https://cse442-17f.github.io/LinUCB/',
        image: 'multi-armed-bandits.png'
      },
      {
        label: 'The Explanation & Comparison of Graph Searches',
        subtitle: 'A walkthrough of depth first, breadth first, and A* search algorithms',
        href: 'https://cse442-17f.github.io/A-Star-Search/',
        image: 'a-star-2.png'
      },
      {
        label: 'Stepping Into the Filter',
        subtitle: "Understanding the edge detection algorithms in your smartphone",
        href: 'https://cse442-17f.github.io/Sobel-Laplacian-and-Canny-Edge-Detection-Algorithms/',
        image: 'sobel-3.png'
      },
      {
        label: 'Sequence Alignment with Dynamic Programming',
        subtitle: 'The Smith-Waterman Algorithm',
        href: 'https://cse442-17f.github.io/Prims-and-A-Star/',
        image: 'smith-waterman.png'
      },
      {
        label: 'Conflict Driven Clause Learning',
        subtitle: 'The Boolean Satisfiability Problem',
        href: 'https://cse442-17f.github.io/Conflict-Driven-Clause-Learning/',
        image: 'conflict-driven.png'
      },
      {
        label: 'Efficient Collision Detection',
        subtitle: "The Gilbert-Johnson-Keerthi distance algorithm",
        href: 'https://cse442-17f.github.io/Gilbert-Johnson-Keerthi-Distance-Algorithm/',
        image: 'collision.png'
      },
    ],
  },
  {
    title : 'Articles and Blog Posts',
    examples: [
      {
        label: 'Autumn Colormaps',
        subtitle: 'A look at trees, colormaps, and chroma.js',
        href: 'https://mathisonian.github.io/idyll/fall-colors/',
        image: 'https://mathisonian.github.io/idyll/fall-colors/images/share.png',
        sourceUrl: "https://github.com/mathisonian/idyll/tree/master/fall-colors"
      },
      {
        label: 'Who Shapes the Open Web?',
        subtitle: 'An interactive tool to explore membership in W3C working groups.',
        href: 'https://mathisonian.github.io/who-shapes-the-open-web/',
        image: 'https://mathisonian.github.io/who-shapes-the-open-web//images/share.png',
        sourceUrl: "https://github.com/mathisonian/who-shapes-the-open-web/"
      },
      {
        label: 'From Nothing to Something in WebGL Using regl',
        href: 'https://rreusser.github.io/from-nothing-to-something-in-webgl-with-regl/',
        image: 'hello-regl.png',
        sourceUrl: "https://github.com/rreusser/rreusser.github.io/tree/master/src/src/from-nothing-to-something-in-webgl-with-regl"
      },
      {
        label: 'Seattle PD’s Dashcam Problem',
        subtitle: 'Visualizing 27 million frames of video lost over four years',
        href: 'https://mathisonian.github.io/dashcam/',
        image: 'https://mathisonian.github.io/dashcam/images/share.png',
        sourceUrl: "https://github.com/mathisonian/dashcam"
      },
      {
        label: 'The United Complaints of America',
        subtitle: 'Analyzing over 700,000 complaints sent to the Consumer Financial Protection Bureau',
        href: 'https://mathisonian.github.io/consumer-complaints/',
        image: 'complaints-2.gif',
        sourceUrl: 'https://github.com/mathisonian/consumer-complaints'
      },
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
    ]
  },
  {
    title: 'Tutorials',
    examples: [
      {
        label: 'Take a Walk on the Idyll Side',
        subtitle: 'Exploring new ways to create interactive documents',
        href: 'https://mathisonian.github.io/idyll/a-walk-on-the-idyll-side/',
        image: 'walk-on-the-idyll-side.png',
        sourceUrl: "https://github.com/mathisonian/idyll/tree/master/introducing-idyll"
      }, {
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
  // {
  //   title: 'Other examples',
  //   examples: [

  //     {
  //       label: 'Scrolly Idyll',
  //       href: 'https://idyll-lang.github.io/idyll/scroll/',
  //       image: 'scroll.gif',
  //     },
  //   ],
  // },
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