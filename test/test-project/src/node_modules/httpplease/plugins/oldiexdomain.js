'use strict';

var
  urllite = require('urllite/lib/core'),
  once = require('../lib/utils/once');

var warningShown = false;

var supportsXHR = once(function() {
  return (
    typeof window !== 'undefined' &&
    window !== null &&
    window.XMLHttpRequest &&
    'withCredentials' in new window.XMLHttpRequest()
  );
});

// This plugin creates a Microsoft `XDomainRequest` in supporting browsers when
// the URL being requested is on a different domain. This is necessary to
// support IE9, which only supports CORS via its proprietary `XDomainRequest`
// object. We need to check the URL because `XDomainRequest` *doesn't* work for
// same domain requests (unless your server sends CORS headers).
// `XDomainRequest` also has other limitations (no custom headers), so we try to
// catch those and error.
module.exports = {
  createXHR: function(req) {
    var a, b, k;

    if (typeof window === 'undefined' || window === null) {
      return;
    }

    a = urllite(req.url);
    b = urllite(window.location.href);

    // Don't do anything for same-domain requests.
    if (!a.host) {
      return;
    }
    if (a.protocol === b.protocol && a.host === b.host && a.port === b.port) {
      return;
    }

    // Show a warning if there are custom headers. We do this even in
    // browsers that won't use XDomainRequest so that users know there's an
    // issue right away, instead of if/when they test in IE9.
    if (!warningShown && req.headers) {
      for (k in req.headers) {
        if (req.headers.hasOwnProperty(k)) {
          warningShown = true;
          if (window && window.console && window.console.warn) {
            window.console.warn('Request headers are ignored in old IE when using the oldiexdomain plugin.');
          }
          break;
        }
      }
    }

    // Don't do anything if we can't do anything (:
    // Don't do anything if the browser supports proper XHR.
    if (window.XDomainRequest && !supportsXHR()) {
      // We've come this far. Might as well make an XDomainRequest.
      var xdr = new window.XDomainRequest();
      xdr.setRequestHeader = function() {}; // Ignore request headers.
      return xdr;
    }
  }
};
