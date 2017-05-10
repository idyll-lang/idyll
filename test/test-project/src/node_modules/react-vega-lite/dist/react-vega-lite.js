(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("vega-lite"), require("react-vega"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "vega-lite", "react-vega"], factory);
	else if(typeof exports === 'object')
		exports["ReactVegaLite"] = factory(require("react"), require("vega-lite"), require("react-vega"));
	else
		root["ReactVegaLite"] = factory(root["React"], root["vl"], root["ReactVega"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createClassFromLiteSpec = undefined;

	var _VegaLite = __webpack_require__(1);

	var _VegaLite2 = _interopRequireDefault(_VegaLite);

	var _createClassFromLiteSpec2 = __webpack_require__(5);

	var _createClassFromLiteSpec3 = _interopRequireDefault(_createClassFromLiteSpec2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _VegaLite2.default;
	var createClassFromLiteSpec = exports.createClassFromLiteSpec = _createClassFromLiteSpec3.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _vegaLite = __webpack_require__(3);

	var _vegaLite2 = _interopRequireDefault(_vegaLite);

	var _reactVega = __webpack_require__(4);

	var _reactVega2 = _interopRequireDefault(_reactVega);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VegaLite = function VegaLite(props) {
	  var parsedProps = _extends({}, props);
	  var combinedSpec = _extends({}, props.spec);
	  if (props.data) {
	    combinedSpec.data = props.data;
	    delete parsedProps.data;
	  }
	  parsedProps.spec = _vegaLite2.default.compile(combinedSpec).spec;

	  return _react2.default.createElement(_reactVega2.default, parsedProps);
	};

	VegaLite.propTypes = _reactVega2.default.propTypes;

	exports.default = VegaLite;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = createClassFromLiteSpec;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _VegaLite = __webpack_require__(1);

	var _VegaLite2 = _interopRequireDefault(_VegaLite);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// USAGE:
	// createClassFromLiteSpec(name, spec);
	// createClassFromLiteSpec(spec);
	function createClassFromLiteSpec() {
	  var spec = arguments.length === 1 ? arguments.length <= 0 ? undefined : arguments[0] : arguments.length <= 1 ? undefined : arguments[1];

	  var propTypes = _extends({}, _VegaLite2.default.propTypes);
	  delete propTypes.spec;

	  function Chart(props) {
	    return _react2.default.createElement(_VegaLite2.default, _extends({ spec: spec }, props));
	  }

	  Chart.getSpec = function getSpec() {
	    return spec;
	  };

	  Chart.propTypes = propTypes;

	  return Chart;
	}

/***/ }
/******/ ])
});
;