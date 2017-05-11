const path = require('path');
const browserify = require('browserify');
const Promise = require('bluebird');

module.exports = function (options) {
  process.env['NODE_ENV'] = 'production';
  const b = browserify(path.join(__dirname, '..', 'client', 'build.js'), options);
  return Promise.promisify(b.bundle, {context: b})().then((bundle) => {
    return bundle.toString('utf8');
  });
}
