jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 second timeout

const Idyll = require('../../');
const fs = require('fs');
const { join, resolve, dirname } = require('path');
const rimraf = require('rimraf');

const getFilenames = (dir) => {
  return fs.readdirSync(dir).filter(f => f !== '.DS_Store');
}

const dirToHash = (dir) => {
  return getFilenames(dir).reduce(
    (acc, val) => {
      let fullPath = join(dir, val);

      if (fs.statSync(fullPath).isFile()) {
        acc[val] = fs.readFileSync(fullPath, 'utf8');
      } else {
        acc[val] = dirToHash(fullPath);
      }

      return acc;
    },
    {}
  );
}

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

beforeAll(() => {
  rimraf.sync(PROJECT_BUILD_DIR);
  rimraf.sync(PROJECT_IDYLL_CACHE);
})

let output;
let idyll;

beforeAll(done => {
  idyll = Idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    datasets: join(PROJECT_DIR, 'data'),
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    css: join(PROJECT_DIR, 'styles.css'),
    googleFonts:["Hanalei Fill"],
    favicon: "static/favicon.ico",
    compiler: {
      spellcheck: false
    },
    minify: false
  });

  idyll.on('update', (o) => {
    output = o;
    projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
    projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
    done();
  }).build();
})

test('options work as expected', () => {
  expect(idyll.getOptions()).toEqual({
    alias: {
      'PackageJsonComponentTest': 'CustomComponent'
    },
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    minify: false,
    ssr: true,
    watch: false,
    open: true,
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    css: join(PROJECT_DIR, 'styles.css'),
    defaultComponents: dirname(require.resolve('idyll-components')),
    temp: ".idyll",
    template: resolve(join(__dirname, '/../../src/client/_index.html')),
    datasets: join(PROJECT_DIR, 'data'),
    static: 'static',
    transform: [],
    port: 3000,
    googleFonts:["Hanalei Fill"],
    outputCSS: "idyll_styles.css",
    outputJS: "idyll_index.js",
    favicon: "static/favicon.ico",
    compiler: {
      spellcheck: false
    },
    inputString: fs.readFileSync(join(PROJECT_DIR, 'index.idl'), 'utf-8')
  })
})

test('creates the expected files', () => {
  expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
})

test('creates the expected HTML', () => {
  expect(projectBuildResults['index.html']).toEqual(EXPECTED_BUILD_RESULTS['index.html']);
});

// test('creates the expected build artifacts', () => {
//   Object.keys(EXPECTED_IDYLL_RESULTS).forEach((key) => {
//     expect(projectIdyllResults[key]).toEqual(EXPECTED_IDYLL_RESULTS[key]);
//   })
// })
test('should construct the AST properly', () => {
  const ast = [
    ["var", [["name", ["value", "exampleVar"]], ["value", ["value", 5]]], []],
    ["data", [["name", ["value", "myData"]], ["source", ["value", "example-data.json"]]], []],
    ["data", [["name", ["value", "myCSVData"]], ["source", ["value", "example-file.csv"]]], []],
    ['TextContainer', [], [
      ["Header", [["title", ["value", "Welcome to Idyll"]], ["subtitle", ["value", "Open index.idl to start writing"]], ["author", ["value", "Your Name Here"]], ["authorLink", ["value", "https://idyll-lang.github.io"]]], []], ["p", [], ["This is an Idyll file. Write text\nas you please in here. To add interactivity,\nyou can add  different components to the text."]], ["Table", [["data", ["variable", "myData"]]], []], ["Table", [["data", ["variable", "myCSVData"]]], []],["p", [], ["Here is how you can use a variable:"]], ["Range", [["min", ["value", 0]], ["max", ["value", 10]], ["value", ["variable", "exampleVar"]]], []], ["Display", [["value", ["variable", "exampleVar"]]], []], ["CodeHighlight", [["language", ["value", "js"]]], ["var code = true;"]], ["p", [], ["And here is a custom component:"]], ["CustomComponent", [], []], ["p", [], ["You can use standard html tags if a\ncomponent with the same name\ndoesn’t exist."]], ["ReactSimplePieChart",[["slices",["expression","[{\n    color: '#7b3af5',\n    value: 0.1,\n  }, {\n    color: '#EAE7D6',\n    value: 0.9, },\n  ]"]]],[]], ["PackageJsonComponentTest", [], []], ["p", [], ["This adds support for indexed components: ", ["CustomComponent.IndexedComponent", [], []]]], ["FunctionalComponent", [], []], ["FunctionalDefaultComponent", [], []], ["CapitalPascal", [], []]
    ]]
  ];

  expect(output.ast).toEqual(ast);
});

test('should include npm components', () => {
  expect(Object.keys(output.components)).toContain('react-simple-pie-chart');
})

test('should include components configured in package.json', () => {
  expect(Object.keys(output.components)).toContain('package-json-component-test');
})
