const Idyll = require('../../');
const fs = require('fs');
const { join, resolve, dirname } = require('path');
const rimraf = require('rimraf');
var AST = require('idyll-ast');
const expect = require('expect');

const getFilenames = dir => {
  return fs.readdirSync(dir).filter(f => f !== '.DS_Store');
};

const dirToHash = dir => {
  return getFilenames(dir).reduce((acc, val) => {
    let fullPath = join(dir, val);

    if (fs.statSync(fullPath).isFile()) {
      acc[val] = fs.readFileSync(fullPath, 'utf8');
    } else {
      acc[val] = dirToHash(fullPath);
    }

    return acc;
  }, {});
};

const PROJECT_DIR = join(__dirname, 'src');

const PROJECT_BUILD_DIR = join(PROJECT_DIR, 'build');
const PROJECT_IDYLL_CACHE = join(PROJECT_DIR, '.idyll');
let projectBuildFilenames;
let projectBuildResults;

const EXPECTED_DIR = join(__dirname, 'expected-output');
// build output to test against
const EXPECTED_BUILD_DIR = join(EXPECTED_DIR, 'build');
const EXPECTED_BUILD_FILENAMES = getFilenames(EXPECTED_BUILD_DIR);
const EXPECTED_BUILD_RESULTS = dirToHash(EXPECTED_BUILD_DIR);

let output;
let idyll;

before(function(done) {
  this.timeout(60000);
  rimraf.sync(PROJECT_BUILD_DIR);
  rimraf.sync(PROJECT_IDYLL_CACHE);
  idyll = Idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    datasets: join(PROJECT_DIR, 'data'),
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    css: join(PROJECT_DIR, 'styles.css'),
    googleFonts: ['Hanalei Fill'],
    favicon: 'static/favicon.ico',
    transformComponents: true,
    compiler: {
      spellcheck: false
    },
    minify: false
  });

  idyll
    .on('update', o => {
      output = o;
      projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
      projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
      done();
    })
    .build();
});

it('options work as expected', () => {
  expect(idyll.getOptions()).toEqual({
    alias: {
      PackageJsonComponentTest: 'CustomComponent'
    },
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    minify: false,
    ssr: true,
    watch: false,
    open: true,
    compileLibs: false,
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    css: join(PROJECT_DIR, 'styles.css'),
    defaultComponents: dirname(require.resolve('idyll-components')),
    temp: '.idyll',
    template: resolve(join(__dirname, '/../../src/client/_index.html')),
    transformComponents: true,
    datasets: join(PROJECT_DIR, 'data'),
    static: 'static',
    staticOutputDir: 'static',
    transform: [],
    port: 3000,
    googleFonts: ['Hanalei Fill'],
    outputCSS: 'idyll_styles.css',
    outputJS: 'idyll_index.js',
    favicon: 'static/favicon.ico',
    compiler: {
      spellcheck: false
    },
    inputString: fs.readFileSync(join(PROJECT_DIR, 'index.idl'), 'utf-8')
  });
});

it('creates the expected files', () => {
  expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
});

it('creates the expected HTML', () => {
  expect(projectBuildResults['index.html']).toEqual(
    EXPECTED_BUILD_RESULTS['index.html']
  );
});

// test('creates the expected build artifacts', () => {
//   Object.keys(EXPECTED_IDYLL_RESULTS).forEach((key) => {
//     expect(projectIdyllResults[key]).toEqual(EXPECTED_IDYLL_RESULTS[key]);
//   })
// })
it('should construct the AST properly', () => {
  const ast = [
    ['var', [['name', ['value', 'exampleVar']], ['value', ['value', 5]]], []],
    [
      'data',
      [
        ['name', ['value', 'myData']],
        ['source', ['value', 'example-data.json']]
      ],
      []
    ],
    [
      'data',
      [
        ['name', ['value', 'myCSVData']],
        ['source', ['value', 'example-file.csv']]
      ],
      []
    ],
    [
      'TextContainer',
      [],
      [
        [
          'meta',
          [
            ['title', ['value', 'Page Title']],
            ['description', ['value', 'Short description of your project']]
          ],
          []
        ],
        [
          'Header',
          [
            ['title', ['value', 'Welcome to Idyll']],
            ['subtitle', ['value', 'Open index.idl to start writing']],
            ['author', ['value', 'Your Name Here']],
            ['authorLink', ['value', 'https://idyll-lang.github.io']]
          ],
          []
        ],
        [
          'p',
          [],
          [
            'This is an Idyll file. Write text\nas you please in here. To add interactivity,\nyou can add  different components to the text.'
          ]
        ],
        ['Table', [['data', ['variable', 'myData']]], []],
        ['Table', [['data', ['variable', 'myCSVData']]], []],
        ['p', [], ['Here is how you can use a variable:']],
        [
          'Range',
          [
            ['min', ['value', 0]],
            ['max', ['value', 10]],
            ['value', ['variable', 'exampleVar']]
          ],
          []
        ],
        ['Display', [['value', ['variable', 'exampleVar']]], []],
        [
          'CodeHighlight',
          [['language', ['value', 'js']]],
          ['var code = true;']
        ],
        ['p', [], ['And here is a custom component:']],
        ['CustomComponent', [], []],
        [
          'p',
          [],
          [
            'You can use standard html tags if a\ncomponent with the same name\ndoesn’t exist.'
          ]
        ],
        [
          'ReactSimplePieChart',
          [
            [
              'slices',
              [
                'expression',
                "[{\n    color: '#7b3af5',\n    value: 0.1,\n  }, {\n    color: '#EAE7D6',\n    value: 0.9, },\n  ]"
              ]
            ]
          ],
          []
        ],
        ['PackageJsonComponentTest', [], []],
        [
          'p',
          [],
          [
            'This adds support for indexed components: ',
            ['CustomComponent.IndexedComponent', [], []]
          ]
        ],
        ['FunctionalComponent', [], []],
        ['FunctionalDefaultComponent', [], []],
        ['CapitalPascal', [], []]
      ]
    ]
  ];

  expect(output.ast).toEqual(AST.convertV1ToV2(ast));
});

it('should include npm components', () => {
  expect(Object.keys(output.components)).toContain('react-simple-pie-chart');
});

it('should include components configured in package.json', () => {
  expect(Object.keys(output.components)).toContain(
    'package-json-component-test'
  );
});

// Tests for default and custom components
it('Idyll getComponents() gets all default & custom components', () => {
  var defaultComponentsDirectory =
    __dirname + '/../../../idyll-components/src/';
  var idyllComponents = idyll.getComponents();
  var componentNames = idyllComponents.map(comp => comp.name + '.js');
  // Ensure that the getComponents() have all of the default component file names
  fs.readdirSync(defaultComponentsDirectory).forEach(file => {
    if (file !== 'index.js') {
      expect(componentNames).toContain(file + '');
    }
  });

  // Ensure that we also get the custom components
  var customComponentsPath = __dirname + '/src/components/';
  fs.readdirSync(customComponentsPath).forEach(file => {
    if (file !== 'index.js') {
      expect(componentNames).toContain(file + '');
    }
  });
});

// Tests that getDatasets returns all datasets
// in an Idyll project
it('Idyll getDatasets() gets all default datasets', () => {
  var datasets = idyll.getDatasets();
  var datasetNames = datasets.map(dataset => dataset.name);
  var thisDatasetPath = __dirname + '/src/data/';
  fs.readdirSync(thisDatasetPath).forEach(file => {
    expect(datasetNames).toContain(file + '');
  });
});
