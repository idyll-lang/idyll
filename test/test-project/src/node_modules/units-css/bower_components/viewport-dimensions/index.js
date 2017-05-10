/* eslint-env browser, node */

'use strict';

var viewport = {};
var width = -1;
var height = -1;


// Public interface
//------------------------------------------------------------------------------

viewport.width = function() {
  return width;
};

viewport.height = function() {
  return height;
};

viewport.max = function() {
  return Math.max(width, height);
};

viewport.min = function() {
  return Math.min(width, height);
};

viewport.setDimensions = function() {
  /* istanbul ignore else */
  if (typeof document !== 'undefined') {
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
  }
};


// Protected methods
//------------------------------------------------------------------------------

viewport.onWindowResize = function() {
  viewport.setDimensions();
};

/* istanbul ignore else */
if (typeof window !== 'undefined') {
  window.addEventListener('resize', viewport.onWindowResize, false);
  window.addEventListener('orientationchange', viewport.onWindowResize, false);

  viewport.setDimensions();
}

// Exports
module.exports = viewport;
