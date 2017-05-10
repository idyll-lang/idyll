/*! @link https://github.com/alexdunphy/viewport, @version 0.1.0, @license MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["viewport"] = factory();
	else
		root["viewport"] = factory();
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
	  width = document.documentElement.clientWidth;
	  height = document.documentElement.clientHeight;
	};


	// Protected methods
	//------------------------------------------------------------------------------

	viewport.onWindowResize = function() {
	  viewport.setDimensions();
	};

	/* istanbul ignore else  */
	if (typeof window !== 'undefined') {
	  window.addEventListener('resize', viewport.onWindowResize, false);
	  window.addEventListener('orientationchange', viewport.onWindowResize, false);

	  viewport.setDimensions();
	}

	// Exports
	module.exports = viewport;


/***/ }
/******/ ])
});
;