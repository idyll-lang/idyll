const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);

module.exports = function (artifacts, paths) {
  return Promise.all([
    writeFile(paths.AST_FILE, artifacts.ast),
    writeFile(paths.COMPONENTS_FILE, artifacts.components),
    writeFile(paths.CSS_OUTPUT, artifacts.css),
    writeFile(paths.DATA_FILE, artifacts.data),
    writeFile(paths.HTML_OUTPUT, artifacts.html),
  ]);
}
