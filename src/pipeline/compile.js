const compile = require('idyll-compiler');

module.exports = function (idyllSource, compilerOptions = {}) {
  return compile(idyllSource, compilerOptions);
}
