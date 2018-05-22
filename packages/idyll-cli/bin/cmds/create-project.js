#! /usr/bin/env node

const fs = require('fs-extra');
const p = require('path');
const { exec } = require('child_process');

const yargs = require('yargs');
const inquirer = require('inquirer');
const chalk = require('chalk');

const PROJECT_ROOT = p.join(__dirname, '../../../../')
const TEMPLATES_DIR = p.join(PROJECT_ROOT, 'packages', 'idyll-template-projects')
const DEFAULT_COMPONENTS_DIR = p.join(PROJECT_ROOT, 'packages', 'idyll-components', 'dist', 'cjs');

const colors = {
  progress: chalk.hex('#6122fb'),
  success: chalk.green,
  failure: chalk.red
}

exports.command = 'create [project-name]';
exports.description = 'Create a new project';
exports.builder = builder;
exports.handler = main;

function builder (yargs) {
  return yargs
    .usage('Usage: $0 create <project-name>')
    .example('$0 create example-project')
}

function main (argv) {
  let projectDir = argv._[0];

  getAllTemplates()
    .then(askQuestions)
    .then(ensureDefaults)
    .then(createProject);

  async function askQuestions (templates) {
    let questions = [];
    if (!projectDir) {
      questions.push({
        name: 'project-dir',
        message: 'Which directory would you like to install your project in?',
        default: 'my-idyll-project'
      })
    }
    questions.push({
      name: 'package-name',
      message: 'What would you like to name your project?',
      default: answers => answers['project-dir'] || projectDir
    });
    questions.push({
      name: 'template',
      type: 'list',
      message: 'Which project template would you like to use?',
      choices: templates
    });
    return inquirer.prompt(questions);
  }

  async function ensureDefaults (answers) {
    if (!answers['project-dir']) answers['project-dir'] = projectDir;
    return answers;
  }
}

async function createProject (answers) {
  let name = answers['package-name'];
  let template = answers['template'];
  let dir = answers['project-dir'];

  let startMessage = `Creating a new Idyll project in ${dir} using the ${template} template...`
  let successMessage = 'Finished creating the project!';
  let doneInstructions = `To start developing, run the following commands in your terminal:
    cd ${dir}
    idyll
  `;
  let dirExistsMessage = 'That directory already exists. Please ensure that your target directory\
\ does not exist.';
  let errorMessage = `Could not create Idyll project in ${dir}`;

  console.log(colors.success(startMessage));
  try {
    await ensureEmptyProject();
    await copyFiles();
    await fillTemplates();
    await installDependencies();
  } catch (err) {
    console.error(colors.failure(`${errorMessage}: ${err}`));
  }
  console.log();
  console.log(colors.success(successMessage));
  console.log(colors.progress(doneInstructions));

  async function ensureEmptyProject () {
    return fs.pathExists(dir)
      .then(exists => {
        if (exists) {
          console.log(colors.failure(dirExistsMessage));
          throw new Error('Directory already exists');
        }
        return true
      });
  }

  async function copyFiles (proceed) {
    console.log(colors.progress('  Copying files from template directory into target directory...'))
    await fs.copy(getTemplatePath(template), dir);
    await fs.copy(DEFAULT_COMPONENTS_DIR, p.join(dir, 'components', 'default'));
  }

  async function fillTemplates () {
    console.log(colors.progress('  Configuring project...'));
    let packagePath = p.join(dir, 'package.json');
    let package = JSON.parse(await fs.readFile(packagePath));
    package.name = name;
    await fs.writeFile(packagePath, JSON.stringify(package, null, 2));
  }

  async function installDependencies () {
    console.log(colors.progress('  Installing dependencies...'));
    return new Promise((resolve, reject) => {
      exec('npm i', {
        cwd: p.join(__dirname, dir)
      }, function (err) {
        if (err) return reject(err);
        return resolve();
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
