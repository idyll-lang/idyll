(function() {
  var URL, urllite;

  urllite = require('../core');

  URL = urllite.URL;

  URL.prototype.toString = function() {
    var authority, prefix, userinfo;
    prefix = this.isSchemeRelative ? '//' : this.protocol === 'file:' ? "" + this.protocol + "///" : this.protocol ? "" + this.protocol + "//" : '';
    userinfo = this.password ? "" + this.username + ":" + this.password : this.username ? "" + this.username : '';
    authority = userinfo ? "" + userinfo + "@" + this.host : this.host ? "" + this.host : '';
    return "" + prefix + authority + this.pathname + this.search + this.hash;
  };

}).call(this);
