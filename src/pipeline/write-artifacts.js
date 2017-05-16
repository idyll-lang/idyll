const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);

module.exports = function (artifacts, paths) {
  return Promise.props({
    ast: writeFile(paths.AST_OUTPUT_FILE, artifacts.ast),
    components: writeFile(paths.COMPONENTS_OUTPUT_FILE, artifacts.components),
    css: writeFile(paths.CSS_OUTPUT_FILE, artifacts.css),
    data: writeFile(paths.DATA_OUTPUT_FILE, artifacts.data),
    html: writeFile(paths.HTML_OUTPUT_FILE, artifacts.html),
  });
}
