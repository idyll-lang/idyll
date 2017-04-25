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

    // it('should lint the scss files', function(done) {
    //     gulp.task('lint-scss', fiveThirtyEightGulpTasks.css.lint());

    //     runSequence('lint-scss', function(err) {
    //         expect(err).to.be(undefined);
    //         done();
    //     });
    // });

    // it('should cachebust the CSS files', function(done) {
    //     gulp.task('css-bust', fiveThirtyEightGulpTasks.css.bust());
    //     runSequence('css-bust', function() {
    //         var cacheBust = JSON.parse(fs.readFileSync(path.resolve(fiveThirtyEightGulpTasks.appDir + '/.cachebust/bust.json')));
    //         expect(cacheBust).to.have.key('test/test-project/public/css/app.css');
    //         done();
    //     });
    // });

});

// describe('image tasks', function() {

//     it('should copy images to the correct output folder', function(done) {
//         gulp.task('images', fiveThirtyEightGulpTasks.images.compile());
//         runSequence('images', function() {
//             var outputImages = fs.readdirSync(path.resolve(outputPath + '/images'));
//             expect(outputImages).to.eql(['logo.jpeg']);
//             done();
//         });
//     });

//     it('should cachebust the image files', function(done) {
//         gulp.task('image-bust', fiveThirtyEightGulpTasks.images.bust());
//         runSequence('image-bust', function() {
//             var cacheBust = JSON.parse(fs.readFileSync(path.resolve(fiveThirtyEightGulpTasks.appDir + '/.cachebust/bust.json')));
//             expect(cacheBust).to.have.key('test/test-project/public/images/logo.jpeg');
//             done();
//         });
//     });

//     it('should sprite the files in the images/sprites folder', function(done) {

//         gulp.task('sprite', fiveThirtyEightGulpTasks.images.sprite());
//         gulp.task('sprite-dep', ['sprite']);
//         runSequence('sprite-dep', function() {
//             var outputImages = fs.readdirSync(path.resolve(outputPath + '/images'));
//             expect(outputImages.indexOf('sprite.png')).to.be.above(-1);
//             done();
//         });
//     });
// });

// describe('template tasks', function() {

//     it('should compile the pug templates', function(done) {
//         gulp.task('pug', fiveThirtyEightGulpTasks.templates.compile());
//         runSequence('pug', function() {
//             var generatedHTML = fs.readFileSync(path.resolve(outputPath + '/index.html')).toString();
//             var expectedHTML = fs.readFileSync(path.resolve(expectedPath + '/index.html')).toString();
//             expect(generatedHTML).to.be(expectedHTML);
//             done();
//         });
//     });

//     it('should copy the html files', function(done) {
//         gulp.task('html', fiveThirtyEightGulpTasks.templates.copyHTML());
//         runSequence('html', function() {
//             var generatedHTML = fs.readFileSync(path.resolve(outputPath + '/preview.html')).toString();
//             var expectedHTML = fs.readFileSync(path.resolve(expectedPath + '/preview.html')).toString();
//             expect(generatedHTML).to.be(expectedHTML);
//             done();
//         });
//     });

//     it('should validate the generated html files', function(done) {
//         gulp.task('pug', fiveThirtyEightGulpTasks.templates.compile());
//         gulp.task('html', fiveThirtyEightGulpTasks.templates.copyHTML());
//         gulp.task('validate-html', ['html', 'pug'], fiveThirtyEightGulpTasks.templates.validate({fail: true}));

//         runSequence('validate-html', function(err) {
//             if(err) {
//                 expect(err.task).to.be('validate-html');
//                 done();
//             } else {
//                 done();
//             }

//         });
//     });

// });

// describe('javascript tasks', function() {

//     it('should compile the js files', function(done) {
//         gulp.task('javascript', fiveThirtyEightGulpTasks.javascript.compile());
//         runSequence('javascript', function() {
//             var generatedJS = fs.readFileSync(path.resolve(outputPath + '/js/bundle.js')).toString();
//             var expectedJS = fs.readFileSync(path.resolve(expectedPath + '/js/bundle.js')).toString();
//             expect(generatedJS).to.be(expectedJS);
//             done();
//         });
//     });

//     it('should compile the promo js files', function(done) {
//         gulp.task('javascript', fiveThirtyEightGulpTasks.javascript.compile({
//           entryPoint: '/js/promo.js'
//         }));
//         runSequence('javascript', function() {
//             var generatedJS = fs.readFileSync(path.resolve(outputPath + '/js/promo.js')).toString();
//             var expectedJS = fs.readFileSync(path.resolve(expectedPath + '/js/promo.js')).toString();
//             expect(generatedJS).to.be(expectedJS);
//             done();
//         });
//     });

//     it('should compile the common js file', function(done) {
//         gulp.task('common-javascript', fiveThirtyEightGulpTasks.javascript.compileCommon({
//             include: ['underscore']
//         }));

//         runSequence('common-javascript', function() {
//             var generatedJS = fs.readFileSync(path.resolve(outputPath + '/js/common.js')).toString();
//             var expectedJS = fs.readFileSync(path.resolve(expectedPath + '/js/common.js')).toString();
//             expect(generatedJS).to.be(expectedJS);
//             done();
//         });
//     });

//     it('should cachebust the js files', function(done) {
//         gulp.task('js-bust', fiveThirtyEightGulpTasks.javascript.bust());
//         runSequence('js-bust', function() {
//             var cacheBust = JSON.parse(fs.readFileSync(path.resolve(fiveThirtyEightGulpTasks.appDir + '/.cachebust/bust.json')));
//             expect(cacheBust).to.have.key('test/test-project/public/js/bundle.js');
//             done();
//         });
//     });

//     it('should uglify the js files in production mode', function(done) {

//         fiveThirtyEightGulpTasks.DEVELOPMENT_MODE = false;

//         gulp.task('javascript', fiveThirtyEightGulpTasks.javascript.compile());
//         runSequence('javascript', function() {
//             var generatedJS = fs.readFileSync(path.resolve(outputPath + '/js/bundle.js')).toString().trim();
//             var expectedJS = fs.readFileSync(path.resolve(expectedPath + '/js/uglified-bundle.js')).toString().trim();
//             expect(generatedJS).to.be(expectedJS);
//             fiveThirtyEightGulpTasks.DEVELOPMENT_MODE = true;
//             done();
//         });
//     });

//     it('should uglify the commonjs files in production mode', function(done) {

//         // this one might take a little longer to run
//         this.timeout(5000);

//         fiveThirtyEightGulpTasks.DEVELOPMENT_MODE = false;

//         gulp.task('common-javascript', fiveThirtyEightGulpTasks.javascript.compileCommon());
//         runSequence('common-javascript', function() {
//             var generatedJS = fs.readFileSync(path.resolve(outputPath + '/js/common.js')).toString().trim();
//             expect(generatedJS).to.be.a('string');
//             expect(generatedJS.length).to.be.above(51557);
//             fiveThirtyEightGulpTasks.DEVELOPMENT_MODE = true;
//             done();
//         });
//     });

// });


// describe('data tasks', function() {

//     it('should compile the data files', function(done) {
//         gulp.task('data', fiveThirtyEightGulpTasks.data.compile());
//         runSequence('data', function() {
//             var generatedData = fs.readFileSync(path.resolve(outputPath + '/data.json')).toString();
//             var expectedData = fs.readFileSync(path.resolve(expectedPath + '/data.json')).toString();
//             expect(generatedData).to.be(expectedData);
//             done();
//         });
//     });

// });


// describe('deployment tasks', function() {
//     it('should update the google spreadsheet config', function(done) {
//         gulp.task('updatePageConfig', fiveThirtyEightGulpTasks.deployment.updatePageConfig());
//         runSequence('updatePageConfig', function() {
//             done();
//         });
//     });
// });

// describe('text tasks', function() {
//     it('should update archie.json', function(done) {
//         gulp.task('archie', fiveThirtyEightGulpTasks.text.archie({fieldID: '18GBsSThtaWQ62oE9xKWlIBZcgR5aMAibk195dNnRcD8'}));
//         runSequence('', function() {
//             done();
//         });
//     });
// });
