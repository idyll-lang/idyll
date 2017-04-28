/* global describe, it */
const expect = require('expect.js');
const idyll = require('..');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'test-project');
const outputPath = path.join(__dirname, 'test-project', 'build');
const expectedPath = path.join(__dirname, 'expected-output');
const expectedFiles = fs.readdirSync(expectedPath);

describe('build task', function() {
    it('should compile the files', function(done) {
        idyll(path.join(inputPath, 'index.idl'), {
          output: outputPath,
          htmlTemplate: path.join(inputPath, '_index.html'),
          componentFolder: path.join(inputPath, 'components'),
          defaultComponents: path.join(inputPath, 'components', 'default'),
          dataFolder: path.join(inputPath, 'data'),
          compilerOptions: {
            spellcheck: false
          },
          build: true
        }, function() {
          const outputFiles = fs.readdirSync(outputPath);
          Object.keys(expectedFiles).forEach((f) => {
            expect(Object.keys(outputFiles).indexOf(f)).to.be.above(-1);
          });
          done();
        });

    });

});
