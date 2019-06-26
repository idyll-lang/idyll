const fs = require('fs-extra');

exports.command = 'clean';
exports.description = 'Remove .idyll folder';

const PATH = './.idyll';

fs.remove(PATH, err => {
  if (err) return console.error(err);
});
