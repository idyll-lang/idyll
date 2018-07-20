const resolve = require('resolve');

module.exports.getLocalIdyll = function () {
  try {
    return resolve.sync('idyll', { basedir: process.cwd() });
  } catch (err) {
    return null;
  }
}
