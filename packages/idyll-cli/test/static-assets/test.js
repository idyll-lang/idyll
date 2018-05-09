jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 second timeout

const fs = require('fs');
const http = require('http');
const { join, resolve, dirname } = require('path');

const rimraf = require('rimraf');
const {
  JSDOM
} = require('jsdom');

const Idyll = require('../../');

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
})

let output;
let idyll;

beforeAll(() => {
  rimraf.sync(PROJECT_BUILD_DIR);
  rimraf.sync(PROJECT_IDYLL_CACHE);
})

beforeAll(done => {
  idyll = Idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    template: join(PROJECT_DIR, 'index.html'),
    components: join(PROJECT_DIR, 'components'),
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    css: join(PROJECT_DIR, 'styles.css'),
    compiler: {
      spellcheck: false
    },
    minify: false,
    watch: true,
    open: false
  });

  idyll.on('update', (o) => {
    output = o;
    projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
    projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
    // Timeout required to ensure browsersync is running.
    setTimeout(done, 1000);
  }).build();
})

afterAll(() => {
  idyll.stopWatching();
})

test('options work as expected', () => {
  expect(idyll.getOptions()).toEqual({
    layout: 'centered',
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    minify: false,
    ssr: true,
    watch: true,
    open: false,
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    template: join(PROJECT_DIR, 'index.html'),
    components: join(PROJECT_DIR, 'components'),
    css: join(PROJECT_DIR, 'styles.css'),
    defaultComponents: dirname(require.resolve('idyll-components')),
    temp: '.idyll',
    static: 'static',
    datasets: 'data',
    transform: [],
    port: 3000,
    compiler: {
      spellcheck: false
    },
    inputString: fs.readFileSync(join(PROJECT_DIR, 'index.idl'), 'utf-8'),
    inputConfig: {
      compiler: {},
      components: {},
      transform: []
    }
  })
})

test('creates the expected files', () => {
  expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
})

test('creates the expected HTML', done => {
  const dom = new JSDOM(projectBuildResults['index.html'], {
    url: 'http://localhost:3000',
    referrer: 'http://localhost:3000',
    runScripts: 'dangerously',
    resources: 'usable'
  });
  // Timeout required to ensure that the JSDOM page load completes.
  setTimeout(() => {
    const document = dom.window.document;
    const svgNode = document.querySelector('svg');
    const imgNode = document.querySelector('img');
    expect(imgNode.src).toEqual('http://localhost:3000/images/wearable.jpg');
    expect(svgNode.childNodes.length).toEqual(5);
    dom.window.close();
    done();
  }, 2000);
})
