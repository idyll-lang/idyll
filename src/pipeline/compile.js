const compile = require('idyll-compiler');
const Promise = require('bluebird');

module.exports = function (idyllSource, compilerOptions = {}) {
  return compile(idyllSource, compilerOptions);
};
