/*! @link https://github.com/alexdunphy/units, @version 0.3.0, @license MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["units"] = factory();
	else
		root["units"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Imports
	var conversions = __webpack_require__(3);
	var isNumeric = __webpack_require__(9);

	var units = {};


	// Expose conversion functions
	//------------------------------------------------------------------------------

	units.conversions = conversions;


	// Properties with non default unit/value
	//------------------------------------------------------------------------------

	var properties = units.properties = {};

	properties.lineHeight =
	properties.opacity =
	properties.scale =
	properties.scale3d =
	properties.scaleX =
	properties.scaleY =
	properties.scaleZ = {
	  'defaultUnit': '',
	  'defaultValue': 1
	};

	properties.rotate =
	properties.rotate3d =
	properties.rotateX =
	properties.rotateY =
	properties.rotateZ =
	properties.skew =
	properties.skewX =
	properties.skewY = {
	  'defaultUnit': 'deg'
	};

	properties.resolution = {
	  'defaultUnit': 'dpi',
	  'defaultValue': 96
	};


	// Public interface
	//------------------------------------------------------------------------------

	units.convert = function(to, value, element, property) {
	  var parts = units.parse(value, property);

	  if (to === '_default') {
	    to = units.getDefaultUnit(property);
	  }

	  return to === parts.unit
	    ? parts.value
	    : units.processConversion(parts.unit, to, parts.value, element, property);
	};

	units.parse = function(value, property) {
	  var parts = {};
	  var matches;

	  if (isNumeric(value)) {
	    parts.value = value;
	    parts.unit = property
	      ? units.getDefaultUnit(property)
	      : '';
	  } else {
	    matches = value.toString().trim().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);

	    if (matches !== null) {
	      parts.value = matches[1];
	      parts.unit = matches[2];
	    } else {
	      parts.unit = value;
	      parts.value = property
	        ? units.getDefaultValue(property)
	        : 0;
	    }
	  }

	  parts.value = parseFloat(parts.value);

	  return parts;
	};

	units.getDefaultValue = function(property) {
	  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultValue !== 'undefined'
	    ? properties[property].defaultValue
	    : 0;
	};

	units.getDefaultUnit = function(property) {
	  return typeof properties[property] !== 'undefined' && typeof properties[property].defaultUnit !== 'undefined'
	    ? properties[property].defaultUnit
	    : 'px';
	};


	// Protected methods
	//------------------------------------------------------------------------------

	units.processConversion = function(fromUnits, toUnits, value, element, property) {
	  var type = units.getConversionType(fromUnits);
	  var method;

	  if (typeof type[fromUnits][toUnits] === 'function') {
	    method = type[fromUnits][toUnits];
	  } else {
	    method = type[type._default][toUnits];
	    value = type[fromUnits][type._default](value, element, property); // Use default unit conversion as an interstitial step
	  }

	  return method(value, element, property);
	};

	units.getConversionType = function(fromUnits) {
	  var property;
	  var type = null;

	  for (property in conversions) {
	    /* istanbul ignore else */
	    if (conversions.hasOwnProperty(property) && typeof conversions[property][fromUnits] !== 'undefined') {
	      type = conversions[property];
	      break;
	    }
	  }

	  return type;
	};

	// Exports
	module.exports = units;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Exports
	module.exports = {
	  'angle': __webpack_require__(4),
	  'length': __webpack_require__(5),
	  'resolution': __webpack_require__(8)
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* eslint-env browser, node */

	'use strict';

	var angle = {'_default': 'deg'};

	// Supported units:
	// deg, grad, rad, turn

	angle.deg = {
	  'grad': function(value) {
	    return value / 0.9;
	  },

	  'rad': function(value) {
	    return value * (Math.PI / 180);
	  },

	  'turn': function(value) {
	    return value / 360;
	  }
	};

	angle.grad = {
	  'deg': function(value) {
	    return value * 0.9;
	  }
	};

	angle.rad = {
	  'deg': function(value) {
	    return value / (Math.PI / 180);
	  }
	};

	angle.turn = {
	  'deg': function(value) {
	    return value * 360;
	  }
	};

	// Exports
	module.exports = angle;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Imports
	var utilities = __webpack_require__(6);
	var viewport = __webpack_require__(7);

	var length = {'_default': 'px'};

	// Supported units:
	// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw

	length[''] = {
	  'px': function(value, element) {
	    return parseFloat(getComputedStyle(element, '').fontSize) * value;
	  }
	};

	length['%'] = {
	  'px': function(value, element, property) {
	    return (value * utilities.getRelativeElementDimension(element, property)) / 100;
	  }
	};

	length.ch = {
	  'px': function(value, element) {
	    return value * utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
	  }
	};

	length.cm = {
	  'px': function(value) {
	    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI);
	  }
	};

	length.em = {
	  'px': function(value, element) {
	    return value * utilities.getElementFontSize(element);
	  }
	};

	length.ex = {
	  'px': function(value, element) {
	    return value * utilities.getCreatedElementHeight(element, null, 'x');
	  }
	};

	length['in'] = {
	  'px': function(value) {
	    return value * utilities.DPI;
	  }
	};

	length.mm = {
	  'px': function(value) {
	    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI) / 10;
	  }
	};

	length.pc = {
	  'px': function(value) {
	    return value * ((utilities.DPI / 72) * 12);
	  }
	};

	length.pt = {
	  'px': function(value) {
	    return value * utilities.DPI / 72;
	  }
	};

	length.px = {
	  '': function(value, element) {
	    return value / parseFloat(getComputedStyle(element, '').fontSize);
	  },

	  '%': function(value, element, property) {
	    return (value / utilities.ifZeroThenOne(utilities.getRelativeElementDimension(element, property))) * 100;
	  },

	  'ch': function(value, element) {
	    return value / utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
	  },

	  'cm': function(value) {
	    return value / utilities.ifZeroThenOne(utilities.DPI) * 2.54;
	  },

	  'em': function(value, element) {
	    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(element));
	  },

	  'ex': function(value, element) {
	    return value / utilities.ifZeroThenOne(utilities.getCreatedElementHeight(element, null, 'x'));
	  },

	  'in': function(value) {
	    return value / utilities.ifZeroThenOne(utilities.DPI);
	  },

	  'mm': function(value) {
	    return value * 2.54 / utilities.ifZeroThenOne(utilities.DPI) * 10;
	  },

	  'pc': function(value) {
	    return value / ((utilities.DPI / 72) * 12);
	  },

	  'pt': function(value) {
	    return value * 72 / utilities.DPI;
	  },

	  'rem': function(value) {
	    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(document.documentElement));
	  },

	  'vh': function(value) {
	    return value / utilities.ifZeroThenOne((viewport.height() / 100));
	  },

	  'vmax': function(value) {
	    return value / utilities.ifZeroThenOne((viewport.max() / 100));
	  },

	  'vmin': function(value) {
	    return value / utilities.ifZeroThenOne((viewport.min() / 100));
	  },

	  'vw': function(value) {
	    return value / utilities.ifZeroThenOne((viewport.width() / 100));
	  }
	};

	length.rem = {
	  'px': function(value) {
	    return value * utilities.getElementFontSize(document.documentElement);
	  }
	};

	length.vh = {
	  'px': function(value) {
	    return value * (viewport.height() / 100);
	  }
	};

	length.vmax = {
	  'px': function(value) {
	    return value * (viewport.max() / 100);
	  }
	};

	length.vmin = {
	  'px': function(value) {
	    return value * (viewport.min() / 100);
	  }
	};

	length.vw = {
	  'px': function(value) {
	    return value * (viewport.width() / 100);
	  }
	};

	// Exports
	module.exports = length;


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Imports
	var utilities = __webpack_require__(6);

	var resolution = {'_default': 'dpi'};

	// Supported units:
	// dpi, dpcm, dppx

	resolution.dpi = {
	  'dpcm': function(value) {
	    return value / 2.54;
	  },

	  'dppx': function(value) {
	    return value / utilities.DPI;
	  }
	};

	resolution.dpcm = {
	  'dpi': function(value) {
	    return value * 2.54;
	  }
	};

	resolution.dppx = {
	  'dpi': function(value) {
	    return value * utilities.DPI;
	  }
	};

	// Exports
	module.exports = resolution;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isNumeric = function (obj) {
	    obj = typeof(obj) === "string" ? obj.replace(/,/g, "") : obj;
	    return !isNaN(parseFloat(obj)) && isFinite(obj) && Object.prototype.toString.call(obj).toLowerCase() !== "[object array]";
	};

	if (true) {
	    if (typeof (module) !== "undefined" && module.exports) {
	        exports = module.exports = isNumeric;
	    }
	    exports.isNumeric = isNumeric;
	}


/***/ }
/******/ ])
});
;