const fs = require('fs-extra');
const inquirer = require('inquirer');
exports.command = 'clean';
exports.description = 'Remove .idyll folder';

const PATH = './.idyll';

exports.handler = async _ => {
  try {
    let isTokenExists = await checkIfTokenExists();
    if (isTokenExists) {
      let userAnswer = await confirmClean();
      if (userAnswer) {
        removeIdyll();
      }
    } else {
      removeIdyll();
    }
  } catch (e) {
    console.log(e);
  }
};

const checkIfTokenExists = _ => {
  return fs.pathExists(`${PATH}/token`);
};

const confirmClean = async _ => {
  const userResponse = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmClean',
      message: `This command will remove the idyll cache folder, including your idyll.pub token.
      Subsequent deploys to idyll.pub will receive a new URL. 
      Are you sure you wish to continue?`,
      default: true
    }
  ]);
  return userResponse.confirmClean;
};

const removeIdyll = _ => {
  fs.remove(PATH, err => {
    if (err) return console.error(err);
  });
};
