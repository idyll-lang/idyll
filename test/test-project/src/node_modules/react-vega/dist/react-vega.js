(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("vega"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "vega"], factory);
	else if(typeof exports === 'object')
		exports["ReactVega"] = factory(require("react"), require("vega"));
	else
		root["ReactVega"] = factory(root["React"], root["vg"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
	exports.createClassFromSpec = undefined;

	var _Vega = __webpack_require__(1);

	var _Vega2 = _interopRequireDefault(_Vega);

	var _createClassFromSpec2 = __webpack_require__(5);

	var _createClassFromSpec3 = _interopRequireDefault(_createClassFromSpec2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Vega2.default;
	var createClassFromSpec = exports.createClassFromSpec = _createClassFromSpec3.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _vega = __webpack_require__(3);

	var _vega2 = _interopRequireDefault(_vega);

	var _util = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var propTypes = {
	  className: _react.PropTypes.string,
	  style: _react.PropTypes.object,
	  spec: _react.PropTypes.object.isRequired,
	  width: _react.PropTypes.number,
	  height: _react.PropTypes.number,
	  padding: _react.PropTypes.object,
	  viewport: _react.PropTypes.array,
	  renderer: _react.PropTypes.string,
	  data: _react.PropTypes.object,
	  updateOptions: _react.PropTypes.object
	};

	var Vega = function (_React$Component) {
	  _inherits(Vega, _React$Component);

	  function Vega() {
	    _classCallCheck(this, Vega);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Vega).apply(this, arguments));
	  }

	  _createClass(Vega, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.createVis(this.props.spec);
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      var a = this.props;
	      var b = nextProps;
	      return ['width', 'height', 'renderer', 'spec', 'data', 'className', 'style'].some(function (name) {
	        return a[name] !== b[name];
	      }) || !Vega.isSameViewport(a.viewport, b.viewport) || !Vega.isSamePadding(a.padding, b.padding);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      var _this2 = this;

	      if (!Vega.isSameSpec(this.props.spec, prevProps.spec)) {
	        this.clearListeners(this.props.spec);
	        this.createVis(this.props.spec);
	      } else if (this.vis) {
	        (function () {
	          var props = _this2.props;
	          var spec = _this2.props.spec;
	          var changed = false;

	          // update view properties
	          ['width', 'height', 'renderer'].forEach(function (field) {
	            if (props[field] !== prevProps[field]) {
	              _this2.vis[field](props[field] || spec[field]);
	              changed = true;
	            }
	          });

	          if (!Vega.isSameViewport) {
	            _this2.vis.viewport(props.viewport || spec.viewport);
	            changed = true;
	          }
	          if (!Vega.isSamePadding) {
	            _this2.vis.padding(props.padding || spec.padding);
	            changed = true;
	          }

	          // update data
	          if (spec.data && props.data) {
	            _this2.vis.update();
	            spec.data.forEach(function (d) {
	              var oldData = prevProps.data[d.name];
	              var newData = props.data[d.name];
	              if (!Vega.isSameData(oldData, newData)) {
	                _this2.updateData(d.name, newData);
	                changed = true;
	              }
	            });
	          }

	          if (changed) {
	            _this2.vis.update(props.updateOptions);
	          }
	        })();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.clearListeners(this.props.spec);
	    }
	  }, {
	    key: 'createVis',
	    value: function createVis(spec) {
	      var _this3 = this;

	      if (spec) {
	        (function () {
	          var props = _this3.props;
	          // Parse the vega spec and create the vis
	          _vega2.default.parse.spec(spec, function (chart) {
	            var vis = chart({ el: _this3.element });

	            // Attach listeners onto the signals
	            if (spec.signals) {
	              spec.signals.forEach(function (signal) {
	                vis.onSignal(signal.name, function () {
	                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                    args[_key] = arguments[_key];
	                  }

	                  var listener = _this3.props[Vega.listenerName(signal.name)];
	                  if (listener) {
	                    listener.apply(_this3, args);
	                  }
	                });
	              });
	            }

	            // store the vis object to be used on later updates
	            _this3.vis = vis;

	            vis.width(props.width || spec.width).height(props.height || spec.height).padding(props.padding || spec.padding).viewport(props.viewport || spec.viewport);
	            if (props.renderer) {
	              vis.renderer(props.renderer);
	            }
	            if (spec.data && props.data) {
	              vis.update();
	              spec.data.forEach(function (d) {
	                _this3.updateData(d.name, props.data[d.name]);
	              });
	            }
	            vis.update();
	          });
	        })();
	      } else {
	        this.clearListeners(this.props.spec);
	        this.vis = null;
	      }
	      return this;
	    }
	  }, {
	    key: 'updateData',
	    value: function updateData(name, value) {
	      if (value) {
	        if ((0, _util.isFunction)(value)) {
	          value(this.vis.data(name));
	        } else {
	          this.vis.data(name).remove(function () {
	            return true;
	          }).insert(value);
	        }
	      }
	    }

	    // Remove listeners from the signals

	  }, {
	    key: 'clearListeners',
	    value: function clearListeners(spec) {
	      var vis = this.vis;
	      if (vis && spec && spec.signals) {
	        spec.signals.forEach(function (signal) {
	          return vis.offSignal(signal.name);
	        });
	      }
	      return this;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      return(
	        // Create the container Vega draws inside
	        _react2.default.createElement('div', {
	          ref: function ref(c) {
	            _this4.element = c;
	          },
	          className: this.props.className,
	          style: this.props.style
	        })
	      );
	    }
	  }], [{
	    key: 'isSameViewport',
	    value: function isSameViewport(a, b) {
	      if (Array.isArray(a) && Array.isArray(b)) {
	        if (a.length !== b.length) return false;
	        return a.every(function (value, index) {
	          return value === b[index];
	        });
	      }
	      return a === b;
	    }
	  }, {
	    key: 'isSamePadding',
	    value: function isSamePadding(a, b) {
	      if ((0, _util.isDefined)(a) && (0, _util.isDefined)(b)) {
	        return a.top === b.top && a.left === b.left && a.right === b.right && a.bottom === b.bottom;
	      }
	      return a === b;
	    }
	  }, {
	    key: 'isSameData',
	    value: function isSameData(a, b) {
	      return a === b && !(0, _util.isFunction)(a);
	    }
	  }, {
	    key: 'isSameSpec',
	    value: function isSameSpec(a, b) {
	      return a === b || JSON.stringify(a) === JSON.stringify(b);
	    }
	  }, {
	    key: 'listenerName',
	    value: function listenerName(signalName) {
	      return 'onSignal' + (0, _util.capitalize)(signalName);
	    }
	  }]);

	  return Vega;
	}(_react2.default.Component);

	Vega.propTypes = propTypes;

	exports.default = Vega;

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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.capitalize = capitalize;
	exports.isDefined = isDefined;
	exports.isFunction = isFunction;
	function capitalize(str) {
	  return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function isDefined(x) {
	  return x !== null && x !== undefined;
	}

	function isFunction(functionToCheck) {
	  var getType = {};
	  return !!functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = createClassFromSpec;

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _Vega = __webpack_require__(1);

	var _Vega2 = _interopRequireDefault(_Vega);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// USAGE:
	// createClassFromSpec(name, spec);
	// createClassFromSpec(spec);
	function createClassFromSpec() {
	  var spec = arguments.length === 1 ? arguments.length <= 0 ? undefined : arguments[0] : arguments.length <= 1 ? undefined : arguments[1];

	  var propTypes = _extends({}, _Vega2.default.propTypes);
	  delete propTypes.spec;
	  if (spec.signals) {
	    spec.signals.forEach(function (signal) {
	      propTypes[_Vega2.default.listenerName(signal.name)] = _react.PropTypes.func;
	    });
	  }

	  function Chart(props) {
	    return _react2.default.createElement(_Vega2.default, _extends({ spec: spec }, props));
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