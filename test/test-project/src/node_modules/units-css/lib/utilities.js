/* eslint-env browser, node */

'use strict';

var utilities = {};

utilities.getElementFontSize = function(element) {
  return typeof getComputedStyle !== 'undefined'
    ? parseFloat(getComputedStyle(element, '').fontSize)
    : 16; // Default browser font-size
};

utilities.getCreatedElementDimensions = function(parent, properties, content) {
  var element = document.createElement('div');
  var style = element.style;
  var dimensions;
  var property;

  style.position = 'absolute';
  style.zIndex = -2147483648;
  style.left = 0;
  style.top = 0;
  style.visibility = 'hidden';

  if (properties) {
    for (property in properties) {
      /* istanbul ignore else */
      if (properties.hasOwnProperty(property)) {
        style[property] = properties[property];
      }
    }
  }

  if (content) {
    element.innerHTML = content;
  }

  parent.appendChild(element);

  dimensions = [
    element.offsetWidth,
    element.offsetHeight
  ];

  parent.removeChild(element);

  return dimensions;
};

utilities.getCreatedElementWidth = function(parent, properties, content) {
  return utilities.getCreatedElementDimensions(parent, properties, content)[0];
};

utilities.getCreatedElementHeight = function(parent, properties, content) {
  return utilities.getCreatedElementDimensions(parent, properties, content)[1];
};

var selfReferenceTriggers = [
  'perspective',
  'translate',
  'translate3d',
  'translateX',
  'translateY',
  'translateZ',
  'transformOrigin'
];

var layoutYTriggers = [
  'height',
  'top',
  'translateY'
];

var positionTriggers = ['absolute', 'fixed'];

utilities.getRelativeElementDimension = function(element, property) {
  var reference;
  var dimension;
  var referenceComputed;
  var useY = layoutYTriggers.indexOf(property) > -1;
  var useSelf = selfReferenceTriggers.indexOf(property) > -1;
  var positioned = positionTriggers.indexOf(getComputedStyle(element, '').position) > -1;

  if (useSelf) {
    reference = element;
  } else {
    reference = positioned
      ? element.offsetParent
      : element.parentNode;
  }

  dimension = useY
    ? reference.offsetHeight
    : reference.offsetWidth;

  if (!useSelf && positioned) {
    referenceComputed = getComputedStyle(reference, '');

    dimension -= useY
      ? parseFloat(referenceComputed.paddingTop) + parseFloat(referenceComputed.paddingBottom)
      : parseFloat(referenceComputed.paddingRight) + parseFloat(referenceComputed.paddingLeft);
  }

  return dimension;
};

utilities.DPI = (function () {
  // Preserve dpi-reliant conversion functionality when not running in browser environment
  /* istanbul ignore next */
  if (typeof window === 'undefined') {
    return 96;
  }

  return utilities.getCreatedElementWidth(document.body, {
    'width': '1in'
  });
}());

/**
 * Return value if non-zero, else return one (to avoid division by zero in calling code).
 *
 * @param {number} value Number to return, converting to one if zero.
 * @returns {number} Non-zero value.
 */
utilities.ifZeroThenOne = function(value) {
  return value === 0
    ? 1
    : value;
};

// Exports
module.exports = utilities;
