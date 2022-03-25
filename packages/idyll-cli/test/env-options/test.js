const Idyll = require('../../src');
const fs = require('fs');
const { join, resolve, dirname } = require('path');
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

const PROJECT_DIR = join(__dirname, 'outer-project', 'inner-project');

const PROJECT_BUILD_DIR = join(PROJECT_DIR, 'build');

describe('env-options', function() {
  it('no env provided', () => {
    const idyll = Idyll({
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

    expect(idyll.getOptions()).toEqual({
      alias: {},
      compileLibs: false,
      compiler: { spellcheck: false },
      components: join(PROJECT_DIR, 'components'),
      css: join(PROJECT_DIR, 'styles.css'),
      datasets: join(PROJECT_DIR, 'data'),
      env: undefined,
      defaultComponents: dirname(require.resolve('idyll-components')),
      favicon: 'static/favicon.ico',
      googleFonts: ['Hanalei Fill'],
      htmlTemplate: join(PROJECT_DIR, '_index.html'),
      inputFile: join(PROJECT_DIR, 'index.idl'),
      layout: 'none',
      minify: false,
      open: true,
      output: join(PROJECT_DIR, 'build'),
      outputCSS: 'idyll_styles.css',
      outputJS: 'idyll_index.js',
      port: 3000,
      ssr: true,
      static: 'static',
      staticOutputDir: 'static',
      temp: '.idyll',
      template: resolve(join(__dirname, '/../../src/client/_index.html')),
      theme: join(PROJECT_DIR, 'custom-theme.css'),
      transform: [],
      watch: false
    });
  });

  it('my-env provided', () => {
    const idyll = Idyll({
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
      minify: false,
      env: 'my-env'
    });

    expect(idyll.getOptions()).toEqual({
      env: 'my-env',
      alias: { PackageJsonComponentTest: 'CustomComponent' },
      compileLibs: false,
      compiler: { spellcheck: false },
      components: join(PROJECT_DIR, 'components'),
      css: join(PROJECT_DIR, 'styles.css'),
      datasets: join(PROJECT_DIR, 'data'),
      env: 'my-env',
      defaultComponents: dirname(require.resolve('idyll-components')),
      favicon: 'static/favicon.ico',
      googleFonts: ['Hanalei Fill'],
      htmlTemplate: join(PROJECT_DIR, '_index.html'),
      inputFile: join(PROJECT_DIR, 'index.idl'),
      layout: 'none',
      minify: false,
      open: true,
      output: join(PROJECT_DIR, 'build'),
      outputCSS: 'idyll_styles.css',
      outputJS: 'idyll_index.js',
      port: 3000,
      ssr: true,
      static: 'static',
      staticOutputDir: 'static',
      temp: '.idyll',
      template: resolve(join(__dirname, '/../../src/client/_index.html')),
      theme: join(PROJECT_DIR, 'custom-theme.css'),
      transform: [],
      watch: false
    });
  });
});
