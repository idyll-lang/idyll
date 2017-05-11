const fs = require('fs');
const UglifyJS = require('uglify-js');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);

module.exports = function (src, path, debug) {
  if (!debug) src = UglifyJS.minify(src, {fromString: true}).code;

  return writeFile(path, src).then(() => src);
}
