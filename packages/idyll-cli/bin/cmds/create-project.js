#! /usr/bin/env node

const fs = require('fs-extra');
const p = require('path');

const spawn = require('cross-spawn');

const yargs = require('yargs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const TEMPLATES_DIR = p.join(
  p.dirname(require.resolve('idyll-template-projects')),
  'templates'
);

const colors = {
  progress: chalk.magenta,
  success: chalk.green,
  failure: chalk.red
};

exports.command = 'create [post-name]';
exports.description = 'Create a new project';
exports.builder = builder;
exports.handler = main;
exports.createProject = createProject;

let _customTemplate;

function buildOptions(yargs) {
  return yargs
    .alias({
      t: 'template',
      i: 'install'
    })
    .default('install', true)
    .nargs('t', 1)
    .describe(
      'template <Path>',
      'Creates Project using custom template at <Path>'
    )
    .describe('install', 'Skip dependency installation');
}

function builder(yargs) {
  return buildOptions(yargs)
    .usage('Usage: $0 create')
    .example('$0 create example-post');
}

function main(argv) {
  let projectDir = argv._[1];
  _customTemplate = argv['t'];

  getAllTemplates()
    .then(askQuestions)
    .then(ensureDefaults)
    .then(createProject);

  async function askQuestions(templates) {
    let questions = [];
    if (!projectDir) {
      questions.push({
        name: 'post-dir',
        message: 'In which directory would you like your project?',
        default: 'my-idyll-post'
      });
    }
    questions.push({
      name: 'package-name',
      message: 'What would you like to name your project?',
      default: answers => answers['post-dir'] || projectDir
    });
    if (!_customTemplate) {
      questions.push({
        name: 'template',
        type: 'list',
        message: 'Which template would you like to use?',
        choices: [...templates, 'Custom']
      });
      questions.push({
        name: 'customTemplate',
        type: 'input',
        message: 'Enter path of custom template.\n',
        when: function(answers) {
          return answers.template === 'Custom';
        }
      });
    }
    console.log();
    return inquirer.prompt(questions);
  }

  async function ensureDefaults(answers) {
    if (!answers['post-dir']) answers['post-dir'] = projectDir;
    answers['template'] =
      _customTemplate || answers.customTemplate || answers.template;
    return answers;
  }
}

async function createProject(answers) {
  let isinstallDependencies;
  if (answers.installDependencies !== undefined) {
    isinstallDependencies = answers.installDependencies;
  } else if (yargs && yargs.argv) {
    isinstallDependencies = yargs.argv.install;
  }
  let name = answers['package-name'];
  let template = answers['template'];
  let dir = answers['post-dir'];

  let startMessage = `\nCreating a new Idyll project in ${dir} using the ${template} template...`;
  let successMessage = 'Finished creating the post!';
  let doneInstructionsText = `To start developing, run the following commands in your terminal:`;
  let doneInstructionsCommand = `    cd ${dir}\n    idyll`;
  let dirExistsMessage =
    'That directory already exists. Please ensure that your target directory\
 does not exist.';
  let errorMessage = `Could not create Idyll project in ${dir}`;
  let stages = [
    ['Ensuring that the target directory is valid', ensureEmptyProject],
    [
      'Copying files from template directory into the target directory',
      copyFiles
    ],
    ['Configuring project', fillTemplates]
  ];
  if (isinstallDependencies) {
    stages.push(['Installing dependencies', installDependencies]);
  }
  console.log(colors.success(startMessage));
  var spinner;
  try {
    for (var i = 0; i < stages.length; i++) {
      let stage = stages[i];
      spinner = ora({
        text: colors.progress(' ' + stage[0])
      });
      spinner.start();
      await stage[1]();
      spinner.succeed();
    }
  } catch (err) {
    if (spinner) spinner.fail(colors.failure(err));
    return;
  }
  console.log();
  console.log(colors.success(successMessage));
  console.log(doneInstructionsText);
  console.log(colors.progress(doneInstructionsCommand));

  async function ensureEmptyProject() {
    return fs.pathExists(dir).then(exists => {
      if (exists) {
        throw new Error(dirExistsMessage);
      }
      return true;
    });
  }

  async function copyFiles(proceed) {
    const filterFunction = path => {
      const testPath = path.replace(TEMPLATES_DIR, '');
      return testPath.indexOf('node_modules') === -1;
    };

    const templatePath = getTemplatePath(
      template,
      answers.customTemplate || _customTemplate
    );

    try {
      await fs.copy(
        templatePath,
        p.isAbsolute(dir) ? dir : p.join(process.cwd(), dir),
        {
          filter: filterFunction
        }
      );
    } catch (err) {
      throw err;
    }
    // Move gitignore if it exists.
    try {
      await fs.move(p.join(dir, 'gitignore'), p.join(dir, '.gitignore'));
    } catch (e) {}
  }

  async function fillTemplates() {
    let packagePath = p.join(dir, 'package.json');
    let indexPath = p.join(dir, 'index.idyll');

    let packageJson = JSON.parse(await fs.readFile(packagePath));
    let indexIdyll = await fs.readFile(indexPath, { encoding: 'utf-8' });

    const slug = name
      .split(' ')
      .join('-')
      .toLowerCase();

    packageJson.name = slug;
    var title = name
      .split('-')
      .join(' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    if (packageJson.idyll) {
      Object.keys(packageJson.idyll).forEach(key => {
        if (typeof packageJson.idyll[key] === 'string') {
          packageJson.idyll[key] = packageJson.idyll[key].replace(
            '[slug]',
            slug
          );
        }
      });
    }

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    // TODO: could add more templating.
    await fs.writeFile(
      indexPath,
      indexIdyll.replace(/\{\{title\}\}/g, title).replace(
        /\{\{date\}\}/g,
        new Date().toLocaleDateString('en-EN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      )
    );
  }

  async function installDependencies() {
    return new Promise((resolve, reject) => {
      let installer = spawn('npm', ['install'], {
        cwd: p.isAbsolute(dir) ? dir : p.join(process.cwd(), dir),
        stdio: 'ignore'
      });
      installer.on('close', code => {
        if (code !== 0) {
          return reject(new Error('Could not install Idyll dependencies.'));
        }
        return resolve();
      });
    });
  }
}

async function getAllTemplates() {
  let templateNames = await fs.readdir(TEMPLATES_DIR);
  return templateNames.map(path => {
    return {
      name: path.split('-').map(c => c[0].toUpperCase() + c.slice(1)),
      value: path
    };
  });
}

function getTemplatePath(templateName, isCustomTemplate = false) {
  if (isCustomTemplate) {
    return p.resolve(templateName);
  }
  return p.join(TEMPLATES_DIR, templateName);
}

if (require.main === module) {
  builder(yargs);
  main(yargs.argv);
}
