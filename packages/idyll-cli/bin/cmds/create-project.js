#! /usr/bin/env node

const fs = require('fs-extra');
const p = require('path');
const spawn = require('cross-spawn');

const yargs = require('yargs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const TEMPLATES_DIR = p.join(p.dirname(require.resolve('idyll-template-projects')), 'templates');

const colors = {
  progress: chalk.hex('#6122fb'),
  success: chalk.green,
  failure: chalk.red
};

exports.command = 'create [post-name]';
exports.description = 'Create a new post';
exports.builder = builder;
exports.handler = main;

let _template;

function builder (yargs) {
  return yargs
    .usage('Usage: $0 create <post-name>')
    .example('$0 create example-post');
}

function main (argv) {
  let projectDir = argv._[1];

  getAllTemplates()
    .then(askQuestions)
    .then(ensureDefaults)
    .then(createProject);

  async function askQuestions (templates) {
    _template = templates[0];
    let questions = [];
    if (!projectDir) {
      questions.push({
        name: 'post-dir',
        message: 'In which directory would you like to install your post?',
        default: 'my-idyll-post'
      })
    }
    questions.push({
      name: 'package-name',
      message: 'What would you like to name your post?',
      default: answers => answers['post-dir'] || projectDir
    });
    // questions.push({
    //   name: 'template',
    //   type: 'list',
    //   message: 'Which project template would you like to use?',
    //   choices: templates
    // });
    console.log();
    return inquirer.prompt(questions);
  }

  async function ensureDefaults (answers) {
    if (!answers['post-dir']) answers['post-dir'] = projectDir;
    return answers;
  }
}

async function createProject (answers) {
  let name = answers['package-name'];
  let template = _template.value; // answers['template'];
  let dir = answers['post-dir'];

  let startMessage = `\nCreating a new Idyll post in ${dir} using the ${template} template...`
  let successMessage = 'Finished creating the post!';
  let doneInstructionsText = `To start developing, run the following commands in your terminal:`;
  let doneInstructionsCommand = `    cd ${dir}\n    idyll`;
  let dirExistsMessage = 'That directory already exists. Please ensure that your target directory\
\ does not exist.';
  let errorMessage = `Could not create Idyll post in ${dir}`;

  let stages = [
    ['Ensuring that the target directory is valid', ensureEmptyProject],
    ['Copying files from template directory into the target directory', copyFiles],
    ['Configuring post', fillTemplates],
    ['Installing dependencies', installDependencies]
  ];

  console.log(colors.success(startMessage));
  var spinner
  try {
    for (var i = 0; i < stages.length; i++) {
      let stage = stages[i]
      spinner = ora({
        text: colors.progress(' ' + stage[0])
      });
      spinner.start();
      await stage[1]();
      spinner.succeed()
    }
  } catch (err) {
    if (spinner) spinner.fail(colors.failure(err));
    return;
  }
  console.log();
  console.log(colors.success(successMessage));
  console.log(doneInstructionsText);
  console.log(colors.progress(doneInstructionsCommand));

  async function ensureEmptyProject () {
    return fs.pathExists(dir)
      .then(exists => {
        if (exists) {
          throw new Error(dirExistsMessage);
        }
        return true;
      });
  }

  async function copyFiles (proceed) {
    await fs.copy(getTemplatePath(template), dir);
    await fs.move(p.join(dir, 'gitignore'), p.join(dir, '.gitignore'));
  }

  async function fillTemplates () {
    let packagePath = p.join(dir, 'package.json');
    let indexPath = p.join(dir, 'index.idyll');

    let packageJson = JSON.parse(await fs.readFile(packagePath));
    let indexIdyll = await fs.readFile(indexPath, { encoding: 'utf-8' });

    packageJson.name = name.split(' ').join('-').toLowerCase();
    var title = name.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase())

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    // TODO: could add more templating.
    await fs.writeFile(indexPath, indexIdyll.replace(/\{\{title\}\}/g, title));
  }

  async function installDependencies () {
    return new Promise((resolve, reject) => {
      let installer = spawn('npm', ['install'], {
        cwd: p.join(process.cwd(), dir),
        stdio: 'ignore'
      })
      installer.on('close', code => {
        if (code !== 0) {
          return reject(new Error('Could not install Idyll dependencies.'))
        }
        return resolve()
      })
    });
  }
}

async function getAllTemplates () {
  let templateNames = await fs.readdir(TEMPLATES_DIR);
  return templateNames.map(path => {
    return {
      name: path.split('-').map(c => c[0].toUpperCase() + c.slice(1)),
      value: path
    }
  });
}

function getTemplatePath (templateName) {
  return p.join(TEMPLATES_DIR, templateName);
}

if (require.main === module) {
  builder(yargs);
  main(yargs.argv);
}
