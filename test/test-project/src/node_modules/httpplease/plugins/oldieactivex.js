/*globals ActiveXObject */
'use strict';

module.exports = {
  createXHR: function() {
    if (typeof window !== 'undefined' && window != null && !window.XMLHttpRequest) {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (ignore) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (ignore) {}
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch (ignore) {}
    }
  }
};
