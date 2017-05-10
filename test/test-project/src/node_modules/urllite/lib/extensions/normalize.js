(function() {
  var URL, extend, urllite;

  urllite = require('../core');

  URL = urllite.URL;

  extend = require('xtend');

  URL.prototype.normalize = function() {
    var m, pathname;
    pathname = this.pathname;
    while (m = /^(.*?)[^\/]+\/\.\.\/*(.*)$/.exec(pathname)) {
      pathname = "" + m[1] + m[2];
    }
    if (this.host && pathname.indexOf('..') !== -1) {
      throw new Error('Path is behind root.');
    }
    return new urllite.URL(extend(this, {
      pathname: pathname
    }));
  };

}).call(this);
