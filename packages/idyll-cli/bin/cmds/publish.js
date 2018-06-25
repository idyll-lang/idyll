#! /usr/bin/env node
const p = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const request = require('request-promise-native');
const urljoin = require('url-join');
const chalk = require('chalk');
const ora = require('ora');

const IDYLL_PUB_API = 'https://idyll-pub-api.now.sh';
const PROJECT_DIR = process.cwd();
const TOKEN_PATH = p.join(PROJECT_DIR, '.idyll', 'token');
const CONFIG = require(p.join(PROJECT_DIR, 'package.json'))

const colors = {
  progress: chalk.hex('#6122fb'),
  success: chalk.green,
  failure: chalk.red
};

exports.command = 'publish'
exports.description = 'Publish your project to idyll.pub'
exports.builder = {}
exports.handler = async (yargs) => {
  let spinner = ora({
    text: colors.progress('Deploying your project to idyll.pub...')
  });

  spinner.start();

  try {
    // TODO: configurable build path.
    let projectDir = p.join(PROJECT_DIR, 'build');
    let token = await getProjectToken();
    let files = await readdir(projectDir);

    let formData = files.reduce((acc, f) => {
      acc[p.relative(projectDir, f)] = fs.createReadStream(f);
      return acc;
    }, {});
    formData.token = token;

    let { alias } = await request.post({
      url: urljoin(IDYLL_PUB_API, 'deploy'),
      formData: formData,
      json: true
    });

    spinner.succeed(colors.success(`Project deployed at https://${alias}.now.sh`));
  } catch (err) {
    spinner.fail(colors.failure(`Could not deploy your project: ${err}`));
  }
}

/**
 * Try to read the project token from the .idyll directory.
 * If it does not exist, create/save one into .idyll/token.
 */
async function getProjectToken () {
  var token;
  try {
    token = await fs.readFile(TOKEN_PATH, { encoding: 'utf-8' });
  } catch (err) {
    let deployment = await request.post({
      url: urljoin(IDYLL_PUB_API, 'create'),
      body: {
        name: CONFIG.name
      },
      json: true
    });
    token = deployment.token;
    await fs.writeFile(TOKEN_PATH, token, { encoding: 'utf-8' });
  }
  return token;
}
