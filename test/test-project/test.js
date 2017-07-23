jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 second timeout

const idyll = require('../../');
const fs = require('fs');
const { join } = require('path');
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
let projectBuildFilenames;
let projectBuildResults;

const EXPECTED_DIR = join(__dirname, 'expected-output');
// build output to test against
const EXPECTED_BUILD_DIR = join(EXPECTED_DIR, 'build');
const EXPECTED_BUILD_FILENAMES = getFilenames(EXPECTED_BUILD_DIR);
const EXPECTED_BUILD_RESULTS = dirToHash(EXPECTED_BUILD_DIR);

beforeAll(() => {
  rimraf.sync(PROJECT_BUILD_DIR);
})

let output;

beforeAll(done => {
  idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    datasets: join(PROJECT_DIR, 'data'),
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    css: join(PROJECT_DIR, 'styles.css'),
    compilerOptions: {
      spellcheck: false
    },
    minify: false
  }).on('update', (o) => {
    output = o;
    projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
    projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
    done();
  }).build();
})

test('creates the expected files', () => {
  expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
})

// test('creates the expected output', () => {
//   expect(projectBuildResults).toEqual(EXPECTED_BUILD_RESULTS);
// })

// test('creates the expected build artifacts', () => {
//   Object.keys(EXPECTED_IDYLL_RESULTS).forEach((key) => {
//     expect(projectIdyllResults[key]).toEqual(EXPECTED_IDYLL_RESULTS[key]);
//   })
// })
test('should construct the AST properly', () => {
  const ast = [["Header",[["title",["value","Welcome to Idyll"]],["subtitle",["value","Open index.idl to start writing"]],["author",["value","Your Name Here"]],["authorLink",["value","https://idyll-lang.github.io"]]],[]],["p",[],["This is an Idyll file. Write text\nas you please in here. To add interactivity,\nyou can add  different components to the text."]],["div",[],[["data",[["name",["value","myData"]],["source",["value","example-data.json"]]],[]],["Table",[["data",["variable","myData"]]],[]]]],["p",[],["Here is how you can use a variable:"]],["var",[["name",["value","exampleVar"]],["value",["value",5]]],[]],["div",[],[["Range",[["min",["value",0]],["max",["value",10]],["value",["variable","exampleVar"]]],[]],["Display",[["value",["variable","exampleVar"]]],[]]]],["CodeHighlight",[["language", ["value", "js"]]],["var code = true;"]],["p",[],["And here is a custom component:"]],["CustomComponent",[],[]],["p",[],["You can use standard html tags if a\ncomponent with the same name\ndoesn’t exist."]],["ReactMicroBarChart",[["data",["expression","[4, 1, 3, 2]"]]],[]],["PackageJsonComponentTest",[],[]],["p",[],["This adds support for indexed components: ",["CustomComponent.IndexedComponent",[],[]]]], ["FunctionalComponent", [], []], ["FunctionalDefaultComponent", [], []], ["CapitalPascal", [], []]];

  expect(output.ast).toEqual(ast);
});

test('should include npm components', () => {
  expect(Object.keys(output.components)).toContain('react-micro-bar-chart');
})

test('should include components configured in package.json', () => {
  expect(Object.keys(output.components)).toContain('package-json-component-test');
})
