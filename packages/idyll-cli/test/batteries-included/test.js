const idyll = require('../../');
const fs = require('fs');
const { join } = require('path');
const rimraf = require('rimraf');
const AST = require('idyll-ast');
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

const PROJECT_DIR = __dirname;
const PROJECT_BUILD_DIR = join(PROJECT_DIR, 'build');

const EXPECTED_DIR = join(__dirname, 'expected-output');
// build output to test against
const EXPECTED_BUILD_DIR = join(EXPECTED_DIR, 'build');
const EXPECTED_BUILD_FILENAMES = getFilenames(EXPECTED_BUILD_DIR);
const EXPECTED_BUILD_RESULTS = dirToHash(EXPECTED_BUILD_DIR);

let output;
let projectBuildFilenames;
let projectBuildResults;

describe('batteries-included project', function() {
  before(function(done) {
    this.timeout(60000);
    rimraf.sync(PROJECT_BUILD_DIR);
    idyll({
      inputFile: join(PROJECT_DIR, 'index.idl'),
      output: PROJECT_BUILD_DIR,
      compiler: {
        spellcheck: false
      },
      minify: false
    })
      .on('update', o => {
        output = o;
        projectBuildFilenames = getFilenames(PROJECT_BUILD_DIR);
        projectBuildResults = dirToHash(PROJECT_BUILD_DIR);
        done();
      })
      .build();
  });

  it('creates the expected files', () => {
    expect(projectBuildFilenames).toEqual(EXPECTED_BUILD_FILENAMES);
  });
  it('should construct the AST properly', () => {
    const ast = [
      ['var', [['name', ['value', 'exampleVar']], ['value', ['value', 5]]], []],
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
          ['pre', [], [['code', [], ['var code = true;']]]],
          ['p', [], ['And here is a custom component:']],
          [
            'p',
            [],
            [
              'You can use standard html tags if a\ncomponent with the same name\ndoesn’t exist.'
            ]
          ]
        ]
      ]
    ];
    expect(output.ast).toEqual(AST.convertV1ToV2(ast));
  });
});
