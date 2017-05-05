const idyll = require('../../');
const fs = require('fs');
const { join } = require('path');

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

const PROJECT_IDYLL_DIR = join(PROJECT_DIR, '.idyll');
let projectIdyllFilenames;
let projectIdyllResults;

const EXPECTED_DIR = join(__dirname, 'expected-output');
// build output to test against
const EXPECTED_BUILD_DIR = join(EXPECTED_DIR, 'build');
const EXPECTED_BUILD_FILENAMES = getFilenames(EXPECTED_BUILD_DIR);
const EXPECTED_BUILD_RESULTS = dirToHash(EXPECTED_BUILD_DIR);
// build metadata to test against
const EXPECTED_IDYLL_DIR = join(EXPECTED_DIR, '.idyll');
const EXPECTED_IDYLL_FILENAMES = getFilenames(EXPECTED_IDYLL_DIR);
const EXPECTED_IDYLL_RESULTS = dirToHash(EXPECTED_IDYLL_DIR);

beforeAll(done => {
  idyll(join(PROJECT_DIR, 'index.idl'), {
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    componentFolder: join(PROJECT_DIR, 'components'),
    defaultComponents: join(PROJECT_DIR, 'components', 'default'),
    dataFolder: join(PROJECT_DIR, 'data'),
    compilerOptions: {
      spellcheck: false
    },
    build: true
  }, () => {
    projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
    projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
    projectIdyllFilenames = getFilenames(PROJECT_IDYLL_DIR);
    projectIdyllResults = dirToHash(PROJECT_IDYLL_DIR);
    done();
  });
})

test('creates the expected files', () => {
  expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
})

test('creates the expected output', () => {
  expect(projectBuildResults).toEqual(EXPECTED_BUILD_RESULTS);
})

test('creates the expected build artifacts', () => {
  expect(projectIdyllResults).toEqual(EXPECTED_IDYLL_RESULTS);
})

test('should include npm components', () => {
  expect(projectIdyllResults['components.js']).toContain('react-micro-bar-chart');
})

test('should include components configured in package.json', () => {
  expect(projectIdyllResults['components.js']).toContain('package-json-component-test');
})
