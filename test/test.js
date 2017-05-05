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

    before(function(done) {
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
          done();
        });
    })

    it('should create the expected files', function(done) {
      const outputFiles = fs.readdirSync(outputPath);
      expectedFiles.forEach(expectedFile => {
        expect(outputFiles.includes(expectedFile)).to.be(true);
      });
      done();
    });

    it('should create files with the correct contents', function(done) {
      const outputFiles = fs.readdirSync(outputPath);
      expectedFiles.forEach(expectedFile => {
        if (expectedFile.indexOf('.js') > -1) {
          return;
        }
        const expectedContents = fs.readFileSync(path.join(expectedPath, expectedFile), 'utf8');
        const outputContents = fs.readFileSync(path.join(outputPath, expectedFile), 'utf8');
        expect(outputContents).to.eql(expectedContents);
      });
      done();
    });

    it('should strip meta from the AST output', function(done) {
      const ast = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-project', '.idyll', 'ast.json')));
      expect(JSON.stringify(ast)).to.eql(JSON.stringify([["Header",[["title",["value","Welcome to Idyll"]],["subtitle",["value","Open index.idl to start writing"]],["author",["value","Your Name Here"]],["authorLink",["value","https://idyll-lang.github.io"]]],[]],["p",[],["This is an Idyll file. Write text\nas you please in here. To add interactivity,\nyou can add  different components to the text."]],["p",[],["Here is how you can use a variable:"]],["var",[["name",["value","exampleVar"]],["value",["value",5]]],[]],["div",[],[["Range",[["min",["value",0]],["max",["value",10]],["value",["variable","exampleVar"]]],[]],["DisplayVar",[["var",["variable","exampleVar"]]],[]]]],["pre",[],[["code",[],["var code = true;"]]]],["p",[],["And here is a custom component:"]],["CustomComponent",[],[]],["p",[],["You can use standard html tags if a\ncomponent with the same name\ndoesn’t exist."]],["ReactMicroBarChart",[["data",["expression","[0, 1, 3, 2]"]]],[]],["PackageJsonComponentTest",[],[]]]));
      done();
    });

    it('should pick up custom npm components', function(done) {
      const componentString = fs.readFileSync(path.join(__dirname, 'test-project', '.idyll', 'components.js'));
      expect(componentString.indexOf('"react-micro-bar-chart": require(\'react-micro-bar-chart\')')).to.be.greaterThan(-1);
      done();
    });

    it('should pick up on explicit component mappings from package.json', function(done) {
      const componentString = fs.readFileSync(path.join(__dirname, 'test-project', '.idyll', 'components.js'));
      expect(componentString.indexOf(`"package-json-component-test": require(\'${path.join(__dirname, 'test-project', 'components', 'custom-component.js').replace(/\\/g, '\\\\')}')`)).to.be.greaterThan(-1);
      done();
    });

});
