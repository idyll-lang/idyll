const { dirname, join } = require('path');
const pathBuilder = require('../../src/path-builder');
const expect = require('expect');

function opts(inputPath, outputPath) {
  const overrideOpts = {};
  if (inputPath) {
    overrideOpts['i'] = inputPath;
    overrideOpts['inputFile'] = inputPath;
  }
  if (outputPath) {
    overrideOpts['o'] = outputPath;
    overrideOpts['output'] = outputPath;
  }
  return {
    alias: {},
    watch: true,
    open: true,
    datasets: 'data',
    minify: false,
    ssr: true,
    staticOutputDir: 'static',
    components: ['components'],
    static: 'static',
    defaultComponents: '',
    layout: 'blog',
    theme: 'github',
    output: 'build',
    outputCSS: 'idyll_styles.css',
    outputJS: 'idyll_index.js',
    port: 3000,
    temp: '.idyll',
    template: '',
    transform: [],
    compiler: {},
    help: false,
    h: false,
    version: false,
    m: ['components'],
    css: 'styles.css',
    c: 'styles.css',
    d: 'data',
    'input-file': 'index.idyll',
    i: 'index.idyll',
    inputFile: 'index.idyll',
    l: 'blog',
    o: 'build',
    googleFonts: [],
    g: [],
    e: 'github',
    ...overrideOpts
  };
}

describe('path builder with input and output args', () => {
  it('should use absolute -i (input path) args directly', () => {
    const inputPath = join('/', 'absolute', 'nested', 'index.idyll');
    const pathOpts = opts(inputPath);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = inputPath;
    const expectedOutputDir = join(process.cwd(), 'build');
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });

  it('should use absolute -o (output path) arg directly', () => {
    const outputDir = join('/', 'nested', 'build');
    const pathOpts = opts(null, outputDir);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = join(process.cwd(), pathOpts.inputFile);
    const expectedOutputDir = outputDir;
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });

  it('should use absolute -i and -o (input and output path) args directly', () => {
    const inputPath = join('/', 'absolute', 'nested', 'index.idyll');
    const outputDir = join('/', 'outputs', 'nested', 'build');
    const pathOpts = opts(inputPath, outputDir);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = inputPath;
    const expectedOutputDir = outputDir;
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });

  it('should resolve relative -i (input path) arg', () => {
    const inputPath = join('nested', 'index.idyll');
    const pathOpts = opts(inputPath);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = join(process.cwd(), inputPath);
    const expectedOutputDir = join(process.cwd(), 'build');
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });

  it('should resolve relative -o (output path) arg', () => {
    const outputPath = join('nested', 'v1', 'build');
    const pathOpts = opts(null, outputPath);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = join(process.cwd(), pathOpts.inputFile);
    const expectedOutputDir = join(process.cwd(), outputPath);
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });

  it('should resolve relative -i and -o (input and output path) args', () => {
    const inputPath = join('nested', 'index.idyll');
    const outputPath = join('build');
    const pathOpts = opts(inputPath, outputPath);
    const paths = pathBuilder(pathOpts);
    const expectedInputPath = join(process.cwd(), inputPath);
    const expectedOutputDir = join(process.cwd(), outputPath);
    expect(paths.IDYLL_INPUT_FILE).toBe(expectedInputPath);
    expect(paths.OUTPUT_DIR).toBe(expectedOutputDir);
  });
});
