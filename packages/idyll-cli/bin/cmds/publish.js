#! /usr/bin/env node
const p = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const request = require('request-promise-native');
const urljoin = require('url-join');
const chalk = require('chalk');
const ora = require('ora');

const IDYLL_PUB_API = 'https://idyll-pub-api.now.sh';
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
    let projectDir = p.join(process.cwd(), 'build');
    let files = await readdir(projectDir)
    let formData = files.reduce((acc, f) => {
      acc[p.relative(projectDir, f)] = fs.createReadStream(f);
      return acc;
    }, {});
    let config = require(p.join(process.cwd(), 'package.json'))
    formData.title = config.name;
    let result = await request.post({
      url: urljoin(IDYLL_PUB_API, 'deploy'),
      formData: formData
    });
    spinner.succeed(colors.success(`Project deployed at https://${result}`));
  } catch (err) {
    spinner.fail(colors.failure(`Could not deploy your project: ${err}`));
  }
}
