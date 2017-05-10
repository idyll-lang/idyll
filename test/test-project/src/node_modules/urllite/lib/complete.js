(function() {
  var urllite;

  urllite = require('./core');

  require('./extensions/resolve');

  require('./extensions/relativize');

  require('./extensions/normalize');

  require('./extensions/toString');

  module.exports = urllite;

}).call(this);
