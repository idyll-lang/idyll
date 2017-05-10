'use strict';

var urllite = require('urllite/lib/core');
require('urllite/lib/extensions/toString');

/**
 * Sets the protocol for requests with procotol-relative URLs to match that of
 * the current page or, in the case of Node (where there is no "current"
 * protocol), the specified default. This works around
 * [issues](http://stackoverflow.com/a/18540123/155370) with cross-protocol
 * requests in browsers and allows you to use protocol-relative URLs in all
 * environments. Use the `override` option to override protocols even when
 * they're specified.
 */
function setprotocol(opts) {
  opts = opts || {};
  var defaultProtocol = opts.defaultProtocol || 'http:',
    override = opts.override === true ? true : false;

  // Make sure there's a trailing colon.
  defaultProtocol = defaultProtocol.replace(/:?$/, ':');

  return {
    processRequest: function(req) {
      var protocol,
        url = urllite(req.url);

      if (url.host) {
        // It's not relative, so we have to update it.

        if (typeof window === 'undefined' || window === null) {
          // Use the default.
          protocol = defaultProtocol;
        } else {
          // Get the current protocol of the page.
          protocol = urllite(window.location.href).protocol;
        }

        if ((url.protocol !== protocol) && (!url.protocol || override)) {
          // We need to update the URL to use the same protocol as the
          // current page.
          req.url = new urllite.URL({
            protocol: protocol,
            username: url.username,
            password: url.password,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
          }).toString();
        }
      }
    }
  };
}

// Allow the plugin to be used without invoking the returned method.
setprotocol.processRequest = setprotocol().processRequest;

module.exports = setprotocol;
