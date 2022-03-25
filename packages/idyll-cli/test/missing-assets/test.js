const { readFileSync, existsSync } = require('fs');
const http = require('http');
const { join, resolve, dirname } = require('path');

const rimraf = require('rimraf');
const expect = require('expect');

const layouts = require('idyll-layouts');
const Idyll = require('../../');

const PROJECT_DIR = join(__dirname, 'src');
const PROJECT_BUILD_DIR = join(PROJECT_DIR, 'build');
const PROJECT_IDYLL_CACHE = join(PROJECT_DIR, '.idyll');

const customCSSPath = join(PROJECT_DIR, 'styles.css');
const themeCSSPath = join(PROJECT_DIR, 'custom-theme.css');
const layoutCSSKey = 'centered';

const themeCSS = readFileSync(themeCSSPath, 'utf8');
const layoutCSS = layouts[layoutCSSKey].styles;
const customCSS = readFileSync(customCSSPath, 'utf8');

before(() => {
  rimraf.sync(PROJECT_BUILD_DIR);
  rimraf.sync(PROJECT_IDYLL_CACHE);
});

function createWithOptions(opts) {
  return Idyll({
    inputFile: join(PROJECT_DIR, 'index.idl'),
    output: PROJECT_BUILD_DIR,
    template: join(PROJECT_DIR, 'index.html'),
    components: join(PROJECT_DIR, 'components'),
    layout: layoutCSSKey,
    theme: themeCSSPath,
    css: customCSSPath,
    outputCSS: '__idyll_styles.css',
    outputJS: '__idyll_index.js',
    compiler: {
      spellcheck: false
    },
    minify: false,
    watch: false,
    open: false,
    ...opts
  });
}

it('handles missing layout css file', done => {
  const idyll = createWithOptions({
    layout: 'nonexistent-layout'
  });

  idyll
    .on('update', () => {
      const outputCSSPath = join(
        PROJECT_BUILD_DIR,
        'static',
        '__idyll_styles.css'
      );
      const outputCSS = readFileSync(outputCSSPath, 'utf8');

      expect(outputCSS.includes(themeCSS)).toBe(true);
      expect(outputCSS.includes(layoutCSS)).toBe(false);
      expect(outputCSS.includes(customCSS)).toBe(true);

      done();
    })
    .build();
});

it('handles missing theme css file', done => {
  const idyll = createWithOptions({
    theme: join(PROJECT_DIR, 'non-existent-theme.css')
  });

  idyll
    .on('update', () => {
      const outputCSSPath = join(
        PROJECT_BUILD_DIR,
        'static',
        '__idyll_styles.css'
      );
      const outputCSS = readFileSync(outputCSSPath, 'utf8');

      expect(outputCSS.includes(themeCSS)).toBe(false);
      expect(outputCSS.includes(layoutCSS)).toBe(true);
      expect(outputCSS.includes(customCSS)).toBe(true);

      done();
    })
    .build();
});

it('handles missing custom css file', done => {
  const idyll = createWithOptions({
    css: 'missing.css'
  });

  idyll
    .on('update', () => {
      const outputCSSPath = join(
        PROJECT_BUILD_DIR,
        'static',
        '__idyll_styles.css'
      );
      const outputCSS = readFileSync(outputCSSPath, 'utf8');

      expect(outputCSS.includes(themeCSS)).toBe(true);
      expect(outputCSS.includes(layoutCSS)).toBe(true);
      expect(outputCSS.includes(customCSS)).toBe(false);

      done();
    })
    .build();
});
