var transformify = require('../')

function toUpper(s) {
  return s.toUpperCase();
}

require('fs').createReadStream(__filename)
  .pipe(transformify(toUpper)(/* file not used */))
  .pipe(process.stdout);
