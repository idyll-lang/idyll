const compile = require('idyll-compiler');
const Promise = require('bluebird');

module.exports =Promise.method(function (idyllSource, compilerOptions = {}) {
  return compile(idyllSource, compilerOptions);
});
