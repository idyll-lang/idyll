const exampleGroups = [
  {
    title: 'Explorable explanations and interactive articles',
    items: [
      {
        label: 'Future of the Oxford Cambridge Arc',
        subtitle: 'An interactive article about urban development modelling',
        href: 'https://nismod.github.io/arc-udm-vis/',
        image: 'transport.png'
      },
      {
        label: "What's an IP address?",
        subtitle: 'How are they allocated? Are we running out?',
        href: 'https://outofips.netlify.app/',
        image: 'ip-explorable.png'
      },
      {
        label: 'The Barnes-Hut Approximation',
        subtitle: 'Efficient computation of N-body forces',
        href: 'https://jheer.github.io/barnes-hut/',
        image: 'barnes-hut.png',
        sourceUrl: 'https://github.com/jheer/barnes-hut'
      },
      {
        label: 'Kernel Density Estimation',
        subtitle: 'An interactive explanation of the statistical technique',
        href: 'https://mathisonian.github.io/kde/',
        image: 'kde.png',
        sourceUrl: 'https://github.com/mathisonian/kde'
      },
      {
        label: 'The Math of Card Shuffling',
        subtitle: 'Riffling from factory order to complete randomness.',
        href: 'https://fredhohman.com/card-shuffling/',
        image: 'cards.png',
        sourceUrl: 'https://github.com/fredhohman/card-shuffling'
      },
      {
        label: 'How does the eye work?',
        href: 'https://idyll.pub/post/the-eye-5b169094cce3bece5d95e964/',
        image: 'the-eye.png'
      },
      {
        label: 'Explorable Flexagons',
        subtitle: 'Learn to create and flex flexagons',
        href: 'http://loki3.com/flex/explore/',
        image: 'flexagons.jpg',
        sourceUrl: 'https://github.com/loki3/flexagonator'
      },
      {
        label: 'Beat Basics',
        subtitle: "Explore 3/4 and 6/8 time using John Varney's rhythm wheel.",
        href: 'https://megan-vo.github.io/basic-beats/',
        image: 'beat-basics.png',
        sourceUrl: 'https://github.com/megan-vo/basic-beats'
      },
      {
        label: "The Beginner's Guide to Dimensionality Reduction",
        subtitle:
          'Explore the methods that data scientists use to visualize high-dimensional data.',
        href:
          'https://idyll.pub/post/dimensionality-reduction-293e465c2a3443e8941b016d/',
        image:
          'https://idyll.pub/post/dimensionality-reduction-293e465c2a3443e8941b016d/static/images/share.png',
        sourceUrl: 'https://github.com/mathisonian/dimensionality-reduction'
      },
      {
        label: 'The Etymology of Trig Functions',
        subtitle: 'A graphic walkthrough of mathematical history',
        href: 'https://mathisonian.github.io/trig/etymology/',
        image: 'trig.png',
        sourceUrl: 'https://github.com/mathisonian/trig/'
      },
      {
        label: 'Bayesian Knowledge Tracing',
        subtitle: 'An explorable explainable',
        href: 'https://eutopi.github.io/bkt-explorable/',
        image: 'bkt.png',
        sourceUrl: 'https://github.com/eutopi/bkt_interactive'
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
        subtitle:
          'A walkthrough of depth first, breadth first, and A* search algorithms',
        href: 'https://cse442-17f.github.io/A-Star-Search/',
        image: 'a-star-2.png'
      },
      {
        label: 'Stepping Into the Filter',
        subtitle:
          'Understanding the edge detection algorithms in your smartphone',
        href:
          'https://cse442-17f.github.io/Sobel-Laplacian-and-Canny-Edge-Detection-Algorithms/',
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
        subtitle: 'The Gilbert-Johnson-Keerthi distance algorithm',
        href:
          'https://cse442-17f.github.io/Gilbert-Johnson-Keerthi-Distance-Algorithm/',
        image: 'collision.png'
      },
      {
        label: 'How to Tune a Guitar',
        subtitle:
          'An interactive audio guide with guitars and a little music theory.',
        href: 'https://mathisonian.github.io/idyll/how-to-tune-a-guitar/',
        image: 'how-to-tune-a-guitar.png',
        sourceUrl: 'https://github.com/mathisonian/how-to-tune-a-guitar'
      },
      {
        label: '77 Nationalities & 66 Currencies',
        subtitle:
          "How do currency exchange rates affect Minerva students' tuition fees?",
        href:
          'https://jasenlo123.github.io/jasenlo123-The-Minerva-Quest---Forex/',
        image: 'forex.png',
        sourceUrl:
          'https://github.com/jasenlo123/jasenlo123-The-Minerva-Quest---Forex'
      },
      {
        label: 'Statistical Power Analysis',
        href:
          'https://idyll.pub/post/statistical-power-d9ff5d116b4c883d22a7888f/',
        image:
          'https://idyll.pub/post/statistical-power-d9ff5d116b4c883d22a7888f/static/images/beaker.png',
        sourceUrl: 'https://github.com/mathisonian/statistical-power'
      },
      {
        label: 'Blueberry Pancakes',
        href:
          'https://idyll.pub/post/blueberry-pancakes-28b1a2e1a8986c44ac091f08/',
        image: 'blueberry-pancakes.png',
        sourceUrl: 'https://github.com/fredhohman/blueberry-pancakes'
      },
      {
        label: 'The D-I-Y Data of Fugazi',
        href: 'https://mathisonian.github.io/diy-data-fugazi/',
        image:
          'https://mathisonian.github.io/diy-data-fugazi/static/images/share.png',
        sourceUrl: 'https://github.com/mathisonian/diy-data-fugazi/'
      },
      {
        label: 'A Comic Introduction to Idyll',
        subtitle:
          'See how Idyll can be used with CSS grid to create a comic-style layout.',
        href: 'https://mathisonian.github.io/idyll-comic/',
        image: 'https://mathisonian.github.io/idyll-comic/static/share.png',
        sourceUrl: 'https://github.com/mathisonian/idyll-comic/'
      },
      {
        label: 'Autumn Colormaps',
        subtitle: 'A look at trees, colormaps, and chroma.js',
        href: 'https://mathisonian.github.io/idyll/fall-colors/',
        image:
          'https://mathisonian.github.io/idyll/fall-colors/images/share.png',
        sourceUrl:
          'https://github.com/mathisonian/idyll/tree/master/fall-colors'
      },
      {
        label: 'Who Shapes the Open Web?',
        subtitle:
          'An interactive tool to explore membership in W3C working groups.',
        href: 'https://mathisonian.github.io/who-shapes-the-open-web/',
        image:
          'https://mathisonian.github.io/who-shapes-the-open-web//images/share.png',
        sourceUrl: 'https://github.com/mathisonian/who-shapes-the-open-web/'
      },
      {
        label: 'From Nothing to Something in WebGL Using regl',
        href:
          'https://rreusser.github.io/from-nothing-to-something-in-webgl-with-regl/',
        image: 'hello-regl.png',
        sourceUrl:
          'https://github.com/rreusser/rreusser.github.io/tree/master/src/src/from-nothing-to-something-in-webgl-with-regl'
      },
      {
        label: 'Seattle PD’s Dashcam Problem',
        subtitle: 'Visualizing 27 million frames of video lost over four years',
        href: 'https://mathisonian.github.io/dashcam/',
        image: 'https://mathisonian.github.io/dashcam/images/share.png',
        sourceUrl: 'https://github.com/mathisonian/dashcam'
      },
      {
        label: 'The United Complaints of America',
        subtitle:
          'Analyzing over 700,000 complaints sent to the Consumer Financial Protection Bureau',
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
        sourceUrl:
          'https://github.com/mathisonian/idyll/tree/master/nonlinear-sliders'
      }
    ]
  }
  // {
  //   title: 'Other examples',
  //   items: [

  //     {
  //       label: 'Scrolly Idyll',
  //       href: 'https://idyll-lang.github.io/idyll/scroll/',
  //       image: 'scroll.gif',
  //     },
  //   ],
  // },
];

export default exampleGroups;
