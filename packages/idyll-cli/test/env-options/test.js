jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // 30 second timeout

const Idyll = require('../../src');
const fs = require('fs');
const { join, resolve, dirname } = require('path');
const rimraf = require('rimraf');

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

beforeAll(() => {
  rimraf.sync(PROJECT_BUILD_DIR);
  rimraf.sync(PROJECT_IDYLL_CACHE);
});

let output;
let idyll = {
  one_env: null,
  two_env_pick_prod: null,
  two_env_pick_dev: null,
  nested: null
};
let idyll_1;

beforeAll(done => {
  idyll_1 = Idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    htmlTemplate: join(PROJECT_DIR, '_index.html'),
    components: join(PROJECT_DIR, 'components'),
    datasets: join(PROJECT_DIR, 'data'),
    theme: join(PROJECT_DIR, 'custom-theme.css'),
    css: join(PROJECT_DIR, 'styles.css'),
    googleFonts: ['Hanalei Fill'],
    favicon: 'static/favicon.ico',
    compiler: {
      spellcheck: false
    },
    minify: false
  });

  idyll_1
    .on('update', o => {
      output = o;
      projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
      projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
      done();
    })
    .build();
});

test('list no env param works as expected', () => {
  expect(idyll_1.getOptions()).toEqual({
    alias: {
      PackageJsonComponentTest: 'CustomComponent'
    },
    layout: 'none',
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
    datasets: join(PROJECT_DIR, 'data'),
    static: 'static',
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
