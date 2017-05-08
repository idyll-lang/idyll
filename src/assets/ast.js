const { paramCase } = require('change-case');

module.exports = function (ast) {
  const ignoreNames = ['meta'];

  return ast.filter(
    (node) => {
      return typeof node === 'string' || !ignoreNames.includes(paramCase(node[0]));
    }
  );
};
