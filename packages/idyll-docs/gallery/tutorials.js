const tutorialsGroups = [
  {
    title: 'Design Patterns',
    items: [
      {
        label: 'Dynamic Datasets',
        subtitle:
          'Using derived variables to easily create reactive views of data in Idyll.',
        href: 'https://idyll.pub/post/derived-table-b00359641a4490037dc3dce7/',
        image: 'dynamic-datasets.png',
        sourceUrl: 'https://github.com/mathisonian/idyll-dynamic-data/'
      },
      {
        label: 'Triggering Updates',
        subtitle: 'How to update components in response to user events.',
        href:
          'https://idyll.pub/post/triggering-updates-22d46bef1e64218d16f2a97b/',
        image: 'triggering-updates.png',
        sourceUrl:
          'https://github.com/mathisonian/idyll-tutorial-triggering-updates'
      },
      {
        label: 'Custom React Components',
        subtitle:
          'Use React to create your own custom graphics inside an Idyll post.',
        href: 'https://tanalan.github.io/idyll-react-components-tutorial/',
        image: 'custom-react.png',
        sourceUrl: 'https://github.com/tanalan/idyll-react-components-tutorial'
      },
      {
        label: 'Animating with Idyll',
        subtitle:
          'How to use CSS animations and custom tweening to animate elements.',
        href:
          'https://idyll.pub/post/animation-example-b0c784887e77d19cf74b3e83/',
        image: 'animating-with-idyll.png',
        sourceUrl: 'https://github.com/mathisonian/idyll-animation-article'
      },
      {
        label: 'Scaffolding Interactives',
        subtitle:
          'Rapidly create scroll- and step-based interactives with Idyll',
        href: 'https://mathisonian.github.io/idyll/scaffolding-interactives/',
        image: 'scaffolding-interactives.gif',
        sourceUrl: 'https://github.com/mathisonian/scaffolding-interactives'
      },
      {
        label: 'Stacking Scroller Components',
        subtitle: 'Introduction to leveraging multiple Scrollers in Idyll',
        href: 'https://idyll.pub/post/stack-scroll-0c3da7fb8e45f3ecb720bcf8/',
        image: 'stacked-scroller.gif',
        sourceUrl: 'https://github.com/megan-vo/stacked-scrolling-tutorial'
      },
      {
        label: 'Dynamic Data Loading',
        subtitle: 'How to load data into Idyll posts at runtime.',
        href: 'https://idyll.pub/post/dynamic-data-e13c64946ffab6b5110af990/',
        image: 'dynamic-data-loading.png'
      }
    ]
  },
  {
    title: 'Library Integrations',
    items: [
      {
        label: 'D3',
        href: 'https://idyll-lang.github.io/idyll-d3-component/',
        image: 'd3.png',
        sourceUrl:
          'https://github.com/idyll-lang/idyll-d3-component/tree/master/examples/basic'
      },
      {
        label: 'Vega Lite',
        href: 'https://idyll-lang.github.io/examples/csv/',
        image: 'vl.png',
        sourceUrl: 'https://github.com/idyll-lang/examples/tree/master/csv'
      },
      {
        label: 'Mapbox',
        subtitle: 'Add interactive maps to your Idyll posts.',
        href: 'https://mathisonian.github.io/idyll-map-example/',
        image: 'mapbox.png',
        sourceUrl: 'https://github.com/mathisonian/idyll-map-example'
      },
      {
        label: 'regl',
        href: 'https://idyll-lang.github.io/idyll-regl-component/',
        image: 'regl.png',
        sourceUrl:
          'https://github.com/idyll-lang/idyll-regl-component/tree/master/examples/basic'
      },
      {
        label: 'Firebase',
        href: 'https://mathisonian.github.io/idyll/firebase/',
        image: 'firebase.png',
        sourceUrl: 'https://github.com/mathisonian/idyll/tree/master/firebase'
      },
      {
        label: 'Apparatus',
        href: 'https://mathisonian.com/writing/apparatus',
        image: 'apparatus.png',
        sourceUrl:
          'https://github.com/mathisonian/mathisonian.github.io/blob/master/pages/writing/apparatus.js'
      }
    ]
  },
  {
    title: 'Idyll Overview',
    items: [
      {
        label: 'Take a Walk on the Idyll Side',
        subtitle: 'Exploring new ways to create interactive documents',
        href: 'https://mathisonian.github.io/idyll/a-walk-on-the-idyll-side/',
        image: 'walk-on-the-idyll-side.png',
        sourceUrl:
          'https://github.com/mathisonian/idyll/tree/master/introducing-idyll'
      },
      {
        label: 'Publishing on idyll.pub',
        subtitle:
          'Easily publish Idyll articles online with our free hosting service.',
        href:
          'https://idyll.pub/post/announcing-idyll-pub-0a3eff0661df3446a915700d/',
        image:
          'https://idyll.pub/post/announcing-idyll-pub-0a3eff0661df3446a915700d/static/images/share.png',
        sourceUrl: 'https://github.com/mathisonian/announcing-idyll-pub'
      }
    ]
  }
];

export default tutorialsGroups;
