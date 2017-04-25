/* global describe, it */
const expect = require('expect.js');
const idyll = require('..');
const fs = require('fs');
const path = require('path');

const inputPath = __dirname + '/test-project/';
const outputPath = __dirname + '/test-project/build/';
const expectedPath = __dirname + '/expected-output';
const expectedFiles = fs.readdirSync(expectedPath);

describe('build task', function() {

    it('should compile the files', function(done) {
        idyll(inputPath + '/index.idl', {
          output: outputPath,
          htmlTemplate: inputPath + '/_index.html',
          componentFolder: inputPath + '/components/',
          defaultComponents: inputPath + '/components/default/',
          dataFolder: inputPath + '/data',
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
